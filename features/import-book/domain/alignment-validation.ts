import type { AlignedParagraph, Language } from "./bilingual-document";
import type { SourceParagraph } from "./paragraphs";

/**
 * Application-level invariants for provider output, beyond schema shape:
 * paragraph identity/order, non-empty segments, and source-text preservation.
 *
 * Returns human-readable problems; an empty array means the result is valid.
 * Source-text comparison ignores whitespace (the provider may re-space around
 * punctuation when segmenting) but any character change is a violation.
 */
export function validateAlignedParagraphs(
  expected: SourceParagraph[],
  received: AlignedParagraph[],
  sourceLanguage: Language,
): string[] {
  const problems: string[] = [];

  const expectedIds = expected.map((p) => p.id);
  const receivedIds = received.map((p) => p.id);

  for (const id of expectedIds) {
    if (!receivedIds.includes(id)) problems.push(`missing paragraph ${id}`);
  }
  for (const id of receivedIds) {
    if (!expectedIds.includes(id)) problems.push(`unexpected paragraph ${id}`);
  }
  if (problems.length > 0) return problems;

  receivedIds.forEach((id, index) => {
    if (id !== expectedIds[index]) problems.push(`paragraph ${id} is out of order`);
  });
  if (problems.length > 0) return problems;

  for (const [index, paragraph] of received.entries()) {
    if (paragraph.segments.length === 0) {
      problems.push(`paragraph ${paragraph.id} has no segments`);
      continue;
    }

    for (const segment of paragraph.segments) {
      if (segment.french.trim() === "" || segment.english.trim() === "") {
        problems.push(`paragraph ${paragraph.id} has a segment with an empty translation`);
      }
    }

    const sourceSide = sourceLanguage === "fr" ? "french" : "english";
    const reconstructed = paragraph.segments.map((s) => s[sourceSide]).join(" ");
    if (stripWhitespace(reconstructed) !== stripWhitespace(expected[index].text)) {
      problems.push(`paragraph ${paragraph.id} no longer matches the imported source text`);
    }
  }

  return problems;
}

function stripWhitespace(text: string): string {
  return text.replace(/\s+/g, "");
}
