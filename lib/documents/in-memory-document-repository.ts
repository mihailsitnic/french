import type { BilingualDocument } from "@/features/import-book/domain/bilingual-document";
import type { DocumentRepository } from "./document-repository";

/**
 * MVP adapter: documents live in server memory for the lifetime of the
 * process. Swap this adapter behind DocumentRepository for durable storage.
 */
export function createInMemoryDocumentRepository(): DocumentRepository {
  const documents = new Map<string, BilingualDocument>();

  return {
    async save(document) {
      documents.set(document.id, document);
    },
    async findById(id) {
      return documents.get(id) ?? null;
    },
  };
}
