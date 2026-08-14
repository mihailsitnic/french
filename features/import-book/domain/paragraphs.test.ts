import { describe, expect, it } from "vitest";
import { parseParagraphs } from "./paragraphs";

describe("parseParagraphs", () => {
  it("splits pasted text into paragraphs with stable sequential ids", () => {
    const text = "Il était une fois une petite fille.\n\nUn jour, sa mère lui dit :";

    expect(parseParagraphs(text)).toEqual([
      { id: "p1", text: "Il était une fois une petite fille." },
      { id: "p2", text: "Un jour, sa mère lui dit :" },
    ]);
  });

  it("joins hard-wrapped lines when blank lines separate the paragraphs", () => {
    const text =
      "Il était une fois une petite fille de village,\nla plus jolie qu'on eût su voir.\n\nSa mère en était folle.";

    expect(parseParagraphs(text)).toEqual([
      { id: "p1", text: "Il était une fois une petite fille de village, la plus jolie qu'on eût su voir." },
      { id: "p2", text: "Sa mère en était folle." },
    ]);
  });

  it("treats single newlines as paragraph boundaries (book paste style)", () => {
    const text = "— Bonjour, dit-elle.\n— Bonjour, répondit le loup.";

    expect(parseParagraphs(text)).toEqual([
      { id: "p1", text: "— Bonjour, dit-elle." },
      { id: "p2", text: "— Bonjour, répondit le loup." },
    ]);
  });

  it("preserves punctuation, accents, apostrophes and quotation marks verbatim", () => {
    const text = "« Qu'est-ce que tu fais ? » demanda-t-elle — sans attendre.";

    expect(parseParagraphs(text)).toEqual([
      { id: "p1", text: "« Qu'est-ce que tu fais ? » demanda-t-elle — sans attendre." },
    ]);
  });

  it("normalises runs of internal spaces and surrounding whitespace", () => {
    const text = "  Il   avait beau essayer.  ";

    expect(parseParagraphs(text)).toEqual([{ id: "p1", text: "Il avait beau essayer." }]);
  });

  it("returns no paragraphs for empty or whitespace-only input", () => {
    expect(parseParagraphs("")).toEqual([]);
    expect(parseParagraphs("  \n\n \t ")).toEqual([]);
  });
});
