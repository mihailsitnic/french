export type PronunciationPlayer = {
  /** Starts pronouncing `text`, replacing any pronunciation in progress. */
  play(text: string): Promise<void>;
};

type Options = {
  /** Injectable for tests; defaults to a real HTMLAudioElement. */
  createAudio?: () => HTMLAudioElement;
};

/**
 * One shared audio element for the whole reader. Assigning a new `src`
 * makes the browser abandon the previous request/stream, so switching
 * segments never overlaps audio. The element streams progressively from
 * the TTS endpoint rather than waiting for a complete file.
 */
export function createPronunciationPlayer({
  createAudio = () => new Audio(),
}: Options = {}): PronunciationPlayer {
  let audio: HTMLAudioElement | null = null;

  return {
    async play(text) {
      const phrase = text.trim();
      if (phrase === "") return;

      audio ??= createAudio();
      audio.pause();
      audio.src = `/api/tts?text=${encodeURIComponent(phrase)}`;
      audio.currentTime = 0;

      try {
        await audio.play();
      } catch {
        // Playback can fail (autoplay policy, TTS error); the reader keeps working.
      }
    },
  };
}
