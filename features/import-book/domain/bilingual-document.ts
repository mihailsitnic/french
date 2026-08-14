import { z } from "zod";

export type Language = "fr" | "en";

/**
 * Canonical schema for provider-produced alignment. Shared by:
 * - OpenAI Structured Output validation
 * - application/domain validation
 * - test fixtures
 */
export const AlignedSegmentSchema = z.object({
  french: z.string().min(1),
  english: z.string().min(1),
});

export const AlignedParagraphSchema = z.object({
  id: z.string().min(1),
  segments: z.array(AlignedSegmentSchema).min(1),
});

export const AlignedParagraphsSchema = z.object({
  paragraphs: z.array(AlignedParagraphSchema),
});

export type AlignedSegment = z.infer<typeof AlignedSegmentSchema>;
export type AlignedParagraph = z.infer<typeof AlignedParagraphSchema>;

/** A reader-ready segment: aligned pair plus a stored, stable identity. */
export type BilingualSegment = AlignedSegment & { id: string };

export type BilingualParagraph = {
  id: string;
  segments: BilingualSegment[];
};

export type BilingualDocument = {
  id: string;
  sourceLanguage: Language;
  paragraphs: BilingualParagraph[];
};
