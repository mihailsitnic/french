import { describe, expect, it, vi } from "vitest";
import type { TextToSpeechProvider } from "./text-to-speech-provider";
import { handleTtsRequest } from "./tts-request";

function createFakeProvider() {
  const synthesize = vi.fn(async () => ({
    audio: new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]));
        controller.close();
      },
    }),
    contentType: "audio/mpeg",
  }));
  const provider: TextToSpeechProvider = { synthesize };
  return { provider, synthesize };
}

function ttsRequest(query: string) {
  return new Request(`http://localhost/api/tts${query}`);
}

describe("handleTtsRequest", () => {
  it("streams synthesized audio for a valid French phrase", async () => {
    const { provider, synthesize } = createFakeProvider();

    const response = await handleTtsRequest(ttsRequest("?text=Il%20y%20avait"), provider);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("audio/mpeg");
    expect(synthesize).toHaveBeenCalledWith("Il y avait");
    expect(response.body).not.toBeNull();
  });

  it("rejects a missing text parameter", async () => {
    const { provider, synthesize } = createFakeProvider();

    const response = await handleTtsRequest(ttsRequest(""), provider);

    expect(response.status).toBe(400);
    expect(synthesize).not.toHaveBeenCalled();
  });

  it("rejects empty and whitespace-only text", async () => {
    const { provider, synthesize } = createFakeProvider();

    const response = await handleTtsRequest(ttsRequest("?text=%20%20"), provider);

    expect(response.status).toBe(400);
    expect(synthesize).not.toHaveBeenCalled();
  });

  it("rejects text above the maximum phrase length", async () => {
    const { provider, synthesize } = createFakeProvider();
    const longText = encodeURIComponent("a ".repeat(300));

    const response = await handleTtsRequest(ttsRequest(`?text=${longText}`), provider);

    expect(response.status).toBe(400);
    expect(synthesize).not.toHaveBeenCalled();
  });

  it("rejects text without any letters", async () => {
    const { provider, synthesize } = createFakeProvider();

    const response = await handleTtsRequest(ttsRequest("?text=123%20%2B%20456"), provider);

    expect(response.status).toBe(400);
    expect(synthesize).not.toHaveBeenCalled();
  });

  it("maps provider failures to a safe 502 without internal details", async () => {
    const provider: TextToSpeechProvider = {
      synthesize: vi.fn().mockRejectedValue(new Error("xi-api-key invalid; request id 123")),
    };

    const response = await handleTtsRequest(ttsRequest("?text=Bonjour"), provider);

    expect(response.status).toBe(502);
    const body = await response.text();
    expect(body).not.toContain("xi-api-key");
    expect(body).not.toContain("request id");
  });
});
