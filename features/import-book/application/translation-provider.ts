import type { AlignedParagraph, Language } from "../domain/bilingual-document";
import type { SourceParagraph } from "../domain/paragraphs";

export type TranslationRequest = {
  paragraphs: SourceParagraph[];
  sourceLanguage: Language;
  targetLanguage: Language;
};

/**
 * Port for translation + semantic alignment. Implementations must return one
 * aligned paragraph per requested paragraph, with the requested ids, and must
 * preserve the source-language text (validated by the application).
 */
export interface TranslationProvider {
  translateAndAlign(request: TranslationRequest): Promise<AlignedParagraph[]>;
}
