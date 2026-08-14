import { describe, expect, it } from "vitest";
import type { BilingualDocument } from "@/features/import-book/domain/bilingual-document";
import { createRedisDocumentRepository } from "./redis-document-repository";

const document: BilingualDocument = {
  id: "doc-1",
  sourceLanguage: "fr",
  paragraphs: [
    { id: "p1", segments: [{ id: "p1-s1", french: "Bonjour", english: "Hello" }] },
  ],
};

function createFakeRedisClient() {
  const store = new Map<string, unknown>();
  return {
    async set(key: string, value: unknown) {
      store.set(key, value);
      return "OK" as const;
    },
    async get<T>(key: string) {
      return (store.get(key) as T) ?? null;
    },
  };
}

describe("RedisDocumentRepository", () => {
  it("returns a saved document by id", async () => {
    const repository = createRedisDocumentRepository({ client: createFakeRedisClient() });
    await repository.save(document);

    await expect(repository.findById("doc-1")).resolves.toEqual(document);
  });

  it("returns null for an unknown id", async () => {
    const repository = createRedisDocumentRepository({ client: createFakeRedisClient() });
    await expect(repository.findById("missing")).resolves.toBeNull();
  });
});
