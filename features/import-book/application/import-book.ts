import type { DocumentRepository } from "@/lib/documents/document-repository";
import { validateAlignedParagraphs } from "../domain/alignment-validation";
import type {
  AlignedParagraph,
  BilingualDocument,
  BilingualParagraph,
  Language,
} from "../domain/bilingual-document";
import { parseParagraphs } from "../domain/paragraphs";
import { createBatches } from "./batching";
import type { TranslationProvider } from "./translation-provider";

export type ImportErrorCode =
  | "INVALID_REQUEST"
  | "EMPTY_INPUT"
  | "INPUT_TOO_LARGE"
  | "TRANSLATION_FAILED";

export type ImportError = { code: ImportErrorCode; message: string };

export type ImportResult = { ok: true; documentId: string } | { ok: false; error: ImportError };

export type ImportRequest = { text: string; sourceLanguage: Language };

export type ImportBookUseCase = (request: ImportRequest) => Promise<ImportResult>;

type Dependencies = {
  translationProvider: TranslationProvider;
  documentRepository: DocumentRepository;
  generateDocumentId?: () => string;
  maxImportCharacters?: number;
  maxBatchCharacters?: number;
};

const DEFAULT_MAX_IMPORT_CHARACTERS = 20_000;
const DEFAULT_MAX_BATCH_CHARACTERS = 2_000;

/**
 * Parse → batch → translate/align → validate → combine → save.
 * Any provider failure or invariant violation results in a controlled
 * TRANSLATION_FAILED error and nothing is persisted.
 */
export function createImportBookUseCase({
  translationProvider,
  documentRepository,
  generateDocumentId = () => crypto.randomUUID(),
  maxImportCharacters = DEFAULT_MAX_IMPORT_CHARACTERS,
  maxBatchCharacters = DEFAULT_MAX_BATCH_CHARACTERS,
}: Dependencies): ImportBookUseCase {
  return async function importBook(request) {
    const text = request.text.trim();
    if (text === "") {
      return failure("EMPTY_INPUT", "Paste some text to import.");
    }
    if (text.length > maxImportCharacters) {
      return failure(
        "INPUT_TOO_LARGE",
        `This text is too long to import (maximum ${maxImportCharacters.toLocaleString("en")} characters).`,
      );
    }

    const paragraphs = parseParagraphs(text);
    if (paragraphs.length === 0) {
      return failure("EMPTY_INPUT", "Paste some text to import.");
    }

    const targetLanguage: Language = request.sourceLanguage === "fr" ? "en" : "fr";
    const batches = createBatches(paragraphs, { maxCharacters: maxBatchCharacters });
    const aligned: AlignedParagraph[] = [];

    for (const batch of batches) {
      let batchResult: AlignedParagraph[];
      try {
        batchResult = await translationProvider.translateAndAlign({
          paragraphs: batch,
          sourceLanguage: request.sourceLanguage,
          targetLanguage,
        });
      } catch {
        return translationFailed();
      }

      const problems = validateAlignedParagraphs(batch, batchResult, request.sourceLanguage);
      if (problems.length > 0) {
        return translationFailed();
      }

      aligned.push(...batchResult);
    }

    const document: BilingualDocument = {
      id: generateDocumentId(),
      sourceLanguage: request.sourceLanguage,
      paragraphs: aligned.map(toBilingualParagraph),
    };

    await documentRepository.save(document);
    return { ok: true, documentId: document.id };
  };
}

function toBilingualParagraph(paragraph: AlignedParagraph): BilingualParagraph {
  return {
    id: paragraph.id,
    segments: paragraph.segments.map((segment, index) => ({
      // Assigned once at creation and stored with the document, so the key is
      // stable from then on even if segments are later edited around it.
      id: `${paragraph.id}-s${index + 1}`,
      ...segment,
    })),
  };
}

function failure(code: ImportErrorCode, message: string): ImportResult {
  return { ok: false, error: { code, message } };
}

function translationFailed(): ImportResult {
  return failure("TRANSLATION_FAILED", "We couldn't translate this text. Please try again.");
}
