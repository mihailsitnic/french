import { describe, expect, it } from "vitest";
import type { SourceParagraph } from "../domain/paragraphs";
import { createBatches } from "./batching";

function paragraph(id: string, length: number): SourceParagraph {
  return { id, text: "a".repeat(length) };
}

describe("createBatches", () => {
  it("puts a short document into a single batch", () => {
    const paragraphs = [paragraph("p1", 100), paragraph("p2", 100)];
    expect(createBatches(paragraphs, { maxCharacters: 1000 })).toEqual([paragraphs]);
  });

  it("splits a long document into multiple batches at paragraph boundaries", () => {
    const paragraphs = [paragraph("p1", 400), paragraph("p2", 400), paragraph("p3", 400)];
    expect(createBatches(paragraphs, { maxCharacters: 1000 })).toEqual([
      [paragraphs[0], paragraphs[1]],
      [paragraphs[2]],
    ]);
  });

  it("keeps every paragraph exactly once and in original order", () => {
    const paragraphs = Array.from({ length: 20 }, (_, i) => paragraph(`p${i + 1}`, 300));
    const batches = createBatches(paragraphs, { maxCharacters: 1000 });

    expect(batches.flat().map((p) => p.id)).toEqual(paragraphs.map((p) => p.id));
  });

  it("gives an oversized paragraph its own batch rather than splitting it", () => {
    const paragraphs = [paragraph("p1", 100), paragraph("p2", 5000), paragraph("p3", 100)];
    expect(createBatches(paragraphs, { maxCharacters: 1000 })).toEqual([
      [paragraphs[0]],
      [paragraphs[1]],
      [paragraphs[2]],
    ]);
  });

  it("returns no batches for an empty document", () => {
    expect(createBatches([], { maxCharacters: 1000 })).toEqual([]);
  });
});
