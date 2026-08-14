import { describe, expect, it } from "vitest";
import type { AlignedParagraph } from "./bilingual-document";
import type { SourceParagraph } from "./paragraphs";
import { validateAlignedParagraphs } from "./alignment-validation";

const source: SourceParagraph[] = [
  { id: "p1", text: "Il y avait une fois un roi." },
  { id: "p2", text: "Elle s'en rendit compte." },
];

const validAligned: AlignedParagraph[] = [
  {
    id: "p1",
    segments: [
      { french: "Il y avait une fois", english: "Once upon a time there was" },
      { french: "un roi.", english: "a king." },
    ],
  },
  {
    id: "p2",
    segments: [{ french: "Elle s'en rendit compte.", english: "She realised it." }],
  },
];

describe("validateAlignedParagraphs", () => {
  it("accepts a valid aligned result", () => {
    expect(validateAlignedParagraphs(source, validAligned, "fr")).toEqual([]);
  });

  it("rejects a result with a missing paragraph", () => {
    const problems = validateAlignedParagraphs(source, [validAligned[0]], "fr");
    expect(problems).not.toHaveLength(0);
    expect(problems.join(" ")).toContain("p2");
  });

  it("rejects a result with an unexpected paragraph", () => {
    const extra: AlignedParagraph = {
      id: "p3",
      segments: [{ french: "Bonjour.", english: "Hello." }],
    };
    expect(validateAlignedParagraphs(source, [...validAligned, extra], "fr")).not.toHaveLength(0);
  });

  it("rejects reordered paragraphs", () => {
    const reordered = [validAligned[1], validAligned[0]];
    expect(validateAlignedParagraphs(source, reordered, "fr")).not.toHaveLength(0);
  });

  it("rejects a paragraph without segments", () => {
    const empty: AlignedParagraph[] = [validAligned[0], { id: "p2", segments: [] }];
    expect(validateAlignedParagraphs(source, empty, "fr")).not.toHaveLength(0);
  });

  it("rejects segments with empty translations", () => {
    const blank: AlignedParagraph[] = [
      validAligned[0],
      { id: "p2", segments: [{ french: "Elle s'en rendit compte.", english: "   " }] },
    ];
    expect(validateAlignedParagraphs(source, blank, "fr")).not.toHaveLength(0);
  });

  it("detects French source text modified by the provider", () => {
    const paraphrased: AlignedParagraph[] = [
      {
        id: "p1",
        segments: [
          { french: "Il était une fois", english: "Once upon a time there was" },
          { french: "un roi.", english: "a king." },
        ],
      },
      validAligned[1],
    ];
    expect(validateAlignedParagraphs(source, paraphrased, "fr")).not.toHaveLength(0);
  });

  it("detects English source text modified when English is the source language", () => {
    const englishSource: SourceParagraph[] = [{ id: "p1", text: "Once upon a time there was a king." }];
    const modified: AlignedParagraph[] = [
      {
        id: "p1",
        segments: [
          { french: "Il y avait une fois", english: "Long ago there lived" },
          { french: "un roi.", english: "a king." },
        ],
      },
    ];
    expect(validateAlignedParagraphs(englishSource, modified, "en")).not.toHaveLength(0);
  });

  it("ignores whitespace-only differences when reconstructing source text", () => {
    const spaced: AlignedParagraph[] = [
      {
        id: "p1",
        segments: [
          { french: "Il y avait une fois", english: "Once upon a time there was" },
          { french: "un roi .", english: "a king." },
        ],
      },
      validAligned[1],
    ];
    expect(validateAlignedParagraphs(source, spaced, "fr")).toEqual([]);
  });
});
