import type { SourceParagraph } from "../domain/paragraphs";

export type BatchingOptions = {
  /** Maximum combined character count of the paragraphs in one batch. */
  maxCharacters: number;
};

/**
 * Groups paragraphs into translation batches without ever splitting a
 * paragraph. A paragraph longer than the limit forms a batch of its own.
 * Deterministic: same input, same batches.
 */
export function createBatches(
  paragraphs: SourceParagraph[],
  options: BatchingOptions,
): SourceParagraph[][] {
  const batches: SourceParagraph[][] = [];
  let current: SourceParagraph[] = [];
  let currentSize = 0;

  function flush() {
    if (current.length === 0) return;
    batches.push(current);
    current = [];
    currentSize = 0;
  }

  for (const paragraph of paragraphs) {
    const fitsInCurrent =
      current.length === 0 || currentSize + paragraph.text.length <= options.maxCharacters;

    if (!fitsInCurrent) flush();

    current.push(paragraph);
    currentSize += paragraph.text.length;

    // An oversized paragraph closes its batch immediately so it travels alone.
    if (currentSize > options.maxCharacters) flush();
  }

  flush();
  return batches;
}
