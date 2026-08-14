import "server-only";

import {
  createImportBookUseCase,
  type ImportBookUseCase,
} from "@/features/import-book/application/import-book";
import { createOpenAITranslationProvider } from "@/features/import-book/infrastructure/openai-translation-provider";
import type { TextToSpeechProvider } from "@/features/pronunciation/application/text-to-speech-provider";
import { createElevenLabsTtsProvider } from "@/features/pronunciation/infrastructure/elevenlabs-tts-provider";
import type { DocumentRepository } from "@/lib/documents/document-repository";
import { createInMemoryDocumentRepository } from "@/lib/documents/in-memory-document-repository";

/**
 * Composition root. Adapters are chosen here and only here; routes and pages
 * depend on the ports. Stored on globalThis so the in-memory document store
 * survives dev-server module reloads.
 */
type Services = {
  documentRepository: DocumentRepository;
  importBook: ImportBookUseCase;
  textToSpeech: TextToSpeechProvider;
};

const globalServices = globalThis as typeof globalThis & { __frenchReaderServices?: Services };

export function getServices(): Services {
  globalServices.__frenchReaderServices ??= createServices();
  return globalServices.__frenchReaderServices;
}

function createServices(): Services {
  const documentRepository = createInMemoryDocumentRepository();

  return {
    documentRepository,
    importBook: createImportBookUseCase({
      translationProvider: createOpenAITranslationProvider(),
      documentRepository,
    }),
    textToSpeech: createElevenLabsTtsProvider(),
  };
}
