import { describe, expect, it, vi } from "vitest";
import type { AlignedParagraph, BilingualDocument, Language } from "../domain/bilingual-document";
import type { SourceParagraph } from "../domain/paragraphs";
import type { TranslationProvider, TranslationRequest } from "./translation-provider";
import { createImportBookUseCase } from "./import-book";

/** Deterministic fake: source side reproduces the input, other side is derived. */
function createFakeProvider() {
  const requests: TranslationRequest[] = [];
  const provider: TranslationProvider = {
    async translateAndAlign(request) {
      requests.push(request);
      return request.paragraphs.map((p): AlignedParagraph => ({
        id: p.id,
        segments: [
          request.sourceLanguage === "fr"
            ? { french: p.text, english: `EN(${p.text})` }
            : { french: `FR(${p.text})`, english: p.text },
        ],
      }));
    },
  };
  return { provider, requests };
}

function createInMemoryRepo() {
  const saved: BilingualDocument[] = [];
  return {
    saved,
    repository: {
      async save(document: BilingualDocument) {
        saved.push(document);
      },
      async findById(id: string) {
        return saved.find((d) => d.id === id) ?? null;
      },
    },
  };
}

function makeUseCase(overrides?: {
  provider?: TranslationProvider;
  maxImportCharacters?: number;
  maxBatchCharacters?: number;
}) {
  const fake = createFakeProvider();
  const repo = createInMemoryRepo();
  const useCase = createImportBookUseCase({
    translationProvider: overrides?.provider ?? fake.provider,
    documentRepository: repo.repository,
    generateDocumentId: () => "doc-1",
    maxImportCharacters: overrides?.maxImportCharacters ?? 10_000,
    maxBatchCharacters: overrides?.maxBatchCharacters ?? 1_000,
  });
  return { useCase, fake, repo };
}

describe("importBook", () => {
  it("requests fr → en translation for French input", async () => {
    const { useCase, fake } = makeUseCase();
    await useCase({ text: "Bonjour le monde.", sourceLanguage: "fr" });

    expect(fake.requests).toHaveLength(1);
    expect(fake.requests[0]).toMatchObject({ sourceLanguage: "fr", targetLanguage: "en" });
  });

  it("requests en → fr translation for English input", async () => {
    const { useCase, fake } = makeUseCase();
    await useCase({ text: "Hello world.", sourceLanguage: "en" });

    expect(fake.requests[0]).toMatchObject({ sourceLanguage: "en", targetLanguage: "fr" });
  });

  it("rejects empty and whitespace-only input without calling the provider", async () => {
    const { useCase, fake } = makeUseCase();
    const result = await useCase({ text: "   \n  ", sourceLanguage: "fr" });

    expect(result).toMatchObject({ ok: false, error: { code: "EMPTY_INPUT" } });
    expect(fake.requests).toHaveLength(0);
  });

  it("rejects input above the maximum import size", async () => {
    const { useCase, fake } = makeUseCase({ maxImportCharacters: 10 });
    const result = await useCase({ text: "This is definitely too long.", sourceLanguage: "en" });

    expect(result).toMatchObject({ ok: false, error: { code: "INPUT_TOO_LARGE" } });
    expect(fake.requests).toHaveLength(0);
  });

  it("saves a bilingual document and returns its id on success", async () => {
    const { useCase, repo } = makeUseCase();
    const result = await useCase({ text: "Bonjour.\n\nAu revoir.", sourceLanguage: "fr" });

    expect(result).toEqual({ ok: true, documentId: "doc-1" });
    expect(repo.saved).toHaveLength(1);
    expect(repo.saved[0]).toMatchObject({
      id: "doc-1",
      sourceLanguage: "fr",
      paragraphs: [
        { id: "p1", segments: [{ french: "Bonjour.", english: "EN(Bonjour.)" }] },
        { id: "p2", segments: [{ french: "Au revoir.", english: "EN(Au revoir.)" }] },
      ],
    });
  });

  it("gives every segment a stable stored id", async () => {
    const { useCase, repo } = makeUseCase();
    await useCase({ text: "Bonjour.\n\nAu revoir.", sourceLanguage: "fr" });

    const ids = repo.saved[0].paragraphs.flatMap((p) => p.segments.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.length > 0)).toBe(true);
  });

  it("splits large documents into multiple provider requests and combines them in order", async () => {
    const { useCase, fake, repo } = makeUseCase({ maxBatchCharacters: 30 });
    const text = "Premier paragraphe assez long.\n\nDeuxième paragraphe assez long.\n\nTroisième.";
    const result = await useCase({ text, sourceLanguage: "fr" });

    expect(result.ok).toBe(true);
    expect(fake.requests.length).toBeGreaterThan(1);
    expect(repo.saved[0].paragraphs.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
  });

  it("fails with TRANSLATION_FAILED and saves nothing when the provider throws", async () => {
    const failing: TranslationProvider = {
      translateAndAlign: vi.fn().mockRejectedValue(new Error("provider down")),
    };
    const { useCase, repo } = makeUseCase({ provider: failing });
    const result = await useCase({ text: "Bonjour.", sourceLanguage: "fr" });

    expect(result).toMatchObject({ ok: false, error: { code: "TRANSLATION_FAILED" } });
    expect(repo.saved).toHaveLength(0);
  });

  it("fails when the provider modifies the source text instead of preserving it", async () => {
    const paraphrasing: TranslationProvider = {
      async translateAndAlign(request) {
        return request.paragraphs.map((p: SourceParagraph): AlignedParagraph => ({
          id: p.id,
          segments: [{ french: "Texte réécrit.", english: "Rewritten text." }],
        }));
      },
    };
    const { useCase, repo } = makeUseCase({ provider: paraphrasing });
    const result = await useCase({ text: "Bonjour tout le monde.", sourceLanguage: "fr" });

    expect(result).toMatchObject({ ok: false, error: { code: "TRANSLATION_FAILED" } });
    expect(repo.saved).toHaveLength(0);
  });

  it("propagates a language pair so provider input always translates between fr and en", async () => {
    const { useCase, fake } = makeUseCase();
    await useCase({ text: "Bonjour.", sourceLanguage: "fr" });
    const request = fake.requests[0];
    const pair: Language[] = [request.sourceLanguage, request.targetLanguage];
    expect(pair.sort()).toEqual(["en", "fr"]);
  });
});
