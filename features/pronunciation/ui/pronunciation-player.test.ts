import { describe, expect, it, vi } from "vitest";
import { createPronunciationPlayer } from "./pronunciation-player";

function createFakeAudio() {
  return {
    src: "",
    currentTime: 0,
    play: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    pause: vi.fn(),
  };
}

function setup() {
  const audio = createFakeAudio();
  const createAudio = vi.fn(() => audio as unknown as HTMLAudioElement);
  const player = createPronunciationPlayer({ createAudio });
  return { player, audio, createAudio };
}

describe("createPronunciationPlayer", () => {
  it("plays the requested French text through the TTS endpoint", async () => {
    const { player, audio } = setup();

    await player.play("Qu'est-ce que tu fais ?");

    expect(audio.src).toBe(`/api/tts?text=${encodeURIComponent("Qu'est-ce que tu fais ?")}`);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it("reuses one shared audio element across plays", async () => {
    const { player, createAudio } = setup();

    await player.play("un");
    await player.play("deux");

    expect(createAudio).toHaveBeenCalledTimes(1);
  });

  it("stops the previous pronunciation when another segment is played", async () => {
    const { player, audio } = setup();

    await player.play("premier");
    await player.play("second");

    expect(audio.pause).toHaveBeenCalled();
    expect(audio.src).toBe(`/api/tts?text=${encodeURIComponent("second")}`);
  });

  it("swallows playback failures instead of crashing the reader", async () => {
    const { player, audio } = setup();
    audio.play.mockRejectedValue(new Error("autoplay blocked"));

    await expect(player.play("Bonjour")).resolves.toBeUndefined();
  });

  it("ignores requests for empty text", async () => {
    const { player, audio, createAudio } = setup();

    await player.play("   ");

    expect(createAudio).not.toHaveBeenCalled();
    expect(audio.play).not.toHaveBeenCalled();
  });
});
