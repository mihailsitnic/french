export type SourceParagraph = {
  id: string;
  text: string;
};

/**
 * Splits pasted book text into paragraphs with stable, application-generated ids.
 *
 * Whitespace normalisation (the only permitted mutation of source text):
 * - when the paste contains blank lines, they delimit paragraphs and single
 *   newlines are treated as soft wraps within one (hard-wrapped book text)
 * - otherwise every newline is a paragraph boundary (one-line-per-paragraph
 *   paste style, common for dialogue)
 * - runs of internal whitespace collapse to a single space
 * - surrounding whitespace is trimmed
 */
export function parseParagraphs(text: string): SourceParagraph[] {
  const hasBlankLines = /\n[ \t]*\n/.test(text);

  return text
    .split(hasBlankLines ? /\n\s*\n/ : /\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .map((line, index) => ({ id: `p${index + 1}`, text: line }));
}
