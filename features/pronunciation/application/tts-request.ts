import type { TextToSpeechProvider } from "./text-to-speech-provider";

/**
 * Guards the paid TTS boundary: only short French phrases from the reader are
 * accepted, and provider failures never leak upstream details to the browser.
 * Longest legitimate input is one aligned reading segment.
 */
const MAX_PHRASE_LENGTH = 300;

export async function handleTtsRequest(
  request: Request,
  provider: TextToSpeechProvider,
): Promise<Response> {
  const text = new URL(request.url).searchParams.get("text");
  const phrase = text?.trim() ?? "";

  if (phrase === "" || phrase.length > MAX_PHRASE_LENGTH || !/\p{L}/u.test(phrase)) {
    return Response.json(
      { code: "INVALID_TEXT", message: "Provide a short phrase to pronounce." },
      { status: 400 },
    );
  }

  try {
    const speech = await provider.synthesize(phrase);
    return new Response(speech.audio, {
      status: 200,
      headers: {
        "content-type": speech.contentType,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "[tts] synthesis failed:",
      error instanceof Error ? error.name : "unknown error",
    );
    return Response.json(
      { code: "TTS_FAILED", message: "We couldn't generate the pronunciation. Please try again." },
      { status: 502 },
    );
  }
}
