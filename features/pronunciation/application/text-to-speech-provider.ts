export type SynthesizedSpeech = {
  audio: ReadableStream<Uint8Array>;
  contentType: string;
};

/**
 * Port for on-demand speech synthesis. Implementations stream audio so
 * playback can begin before generation finishes.
 */
export interface TextToSpeechProvider {
  synthesize(text: string): Promise<SynthesizedSpeech>;
}
