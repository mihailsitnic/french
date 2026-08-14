import "server-only";

import {
  createImportBookUseCase,
  type ImportBookUseCase,
} from "@/features/import-book/application/import-book";
import { createOpenAITranslationProvider } from "@/features/import-book/infrastructure/openai-translation-provider";
import type { TextToSpeechProvider } from "@/features/pronunciation/application/text-to-speech-provider";
import { createElevenLabsTtsProvider } from "@/features/pronunciation/infrastructure/elevenlabs-tts-provider";
import type { DocumentRepository } from "@/lib/documents/document-repository";
import { createRedisDocumentRepository } from "@/lib/documents/redis-document-repository";

/**
 * Composition root. Adapters are chosen here and only here; routes and pages
 * depend on the ports. Stored on globalThis so a single instance is reused
 * across dev-server module reloads and warm serverless invocations.
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
  const documentRepository = createRedisDocumentRepository();

  return {
    documentRepository,
    importBook: createImportBookUseCase({
      translationProvider: createOpenAITranslationProvider(),
      documentRepository,
    }),
    textToSpeech: createElevenLabsTtsProvider(),
  };
}
