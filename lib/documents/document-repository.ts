import type { BilingualDocument } from "@/features/import-book/domain/bilingual-document";

/**
 * Persistence seam for reader documents. The MVP adapter is in-memory;
 * swap the adapter (not the callers) to move to durable storage.
 */
export interface DocumentRepository {
  save(document: BilingualDocument): Promise<void>;
  findById(id: string): Promise<BilingualDocument | null>;
}
