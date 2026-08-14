import { describe, expect, it, vi } from "vitest";
import { TtsProviderError, createElevenLabsTtsProvider } from "./elevenlabs-tts-provider";

function audioResponse() {
  return new Response(new Uint8Array([1, 2, 3]), {
    status: 200,
    headers: { "content-type": "audio/mpeg" },
  });
}

function setup(response: Response = audioResponse()) {
  const fetchFn = vi.fn(async () => response);
  const provider = createElevenLabsTtsProvider({
    fetchFn,
    apiKey: "test-key",
    voiceId: "test-voice",
    modelId: "test-model",
  });
  return { provider, fetchFn };
}

describe("createElevenLabsTtsProvider", () => {
  it("requests streamed speech from the configured voice", async () => {
    const { provider, fetchFn } = setup();

    await provider.synthesize("Bonjour tout le monde");

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/text-to-speech/test-voice/stream");
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("xi-api-key")).toBe("test-key");
    expect(JSON.parse(init.body as string)).toMatchObject({
      text: "Bonjour tout le monde",
      model_id: "test-model",
    });
  });

  it("returns the audio stream and content type", async () => {
    const { provider } = setup();

    const result = await provider.synthesize("Bonjour");

    expect(result.contentType).toBe("audio/mpeg");
    expect(result.audio).toBeInstanceOf(ReadableStream);
  });

  it("throws a safe error when the provider responds with a failure", async () => {
    const { provider } = setup(new Response("upstream secret details", { status: 401 }));

    await expect(provider.synthesize("Bonjour")).rejects.toBeInstanceOf(TtsProviderError);
    await expect(provider.synthesize("Bonjour")).rejects.not.toThrow(/secret/);
  });
});
