import { describe, expect, it } from "vitest";
import type { BilingualDocument } from "@/features/import-book/domain/bilingual-document";
import { createInMemoryDocumentRepository } from "./in-memory-document-repository";

const document: BilingualDocument = {
  id: "doc-1",
  sourceLanguage: "fr",
  paragraphs: [
    { id: "p1", segments: [{ id: "p1-s1", french: "Bonjour", english: "Hello" }] },
  ],
};

describe("InMemoryDocumentRepository", () => {
  it("returns a saved document by id", async () => {
    const repository = createInMemoryDocumentRepository();
    await repository.save(document);

    await expect(repository.findById("doc-1")).resolves.toEqual(document);
  });

  it("returns null for an unknown id", async () => {
    const repository = createInMemoryDocumentRepository();
    await expect(repository.findById("missing")).resolves.toBeNull();
  });
});
