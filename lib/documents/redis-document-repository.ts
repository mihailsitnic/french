import { Redis } from "@upstash/redis";
import type { BilingualDocument } from "@/features/import-book/domain/bilingual-document";
import type { DocumentRepository } from "./document-repository";

const KEY_PREFIX = "document:";

type RedisClient = Pick<Redis, "get" | "set">;

type Options = {
  /** Injectable for tests; defaults to a client built from KV_REST_API_URL/TOKEN. */
  client?: RedisClient;
};

/**
 * Durable adapter: documents persist in Upstash Redis so they survive across
 * serverless invocations and deploys, unlike the in-memory adapter.
 */
export function createRedisDocumentRepository(options: Options = {}): DocumentRepository {
  const client =
    options.client ??
    new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

  return {
    async save(document) {
      await client.set(KEY_PREFIX + document.id, document);
    },
    async findById(id) {
      return (await client.get<BilingualDocument>(KEY_PREFIX + id)) ?? null;
    },
  };
}
