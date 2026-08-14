import type {
  SynthesizedSpeech,
  TextToSpeechProvider,
} from "../application/text-to-speech-provider";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";
// "George" — a clear default narration voice; override with ELEVENLABS_VOICE_ID.
const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

export class TtsProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TtsProviderError";
  }
}

type Options = {
  /** Injectable for tests; defaults to global fetch. */
  fetchFn?: typeof fetch;
  apiKey?: string;
  voiceId?: string;
  modelId?: string;
};

/**
 * ElevenLabs adapter for the TextToSpeechProvider port, using the streaming
 * endpoint so audio bytes flow to the client as they are generated. The API
 * key stays on the server; upstream error bodies are never propagated.
 */
export function createElevenLabsTtsProvider(options: Options = {}): TextToSpeechProvider {
  const fetchFn = options.fetchFn ?? fetch;

  return {
    async synthesize(text): Promise<SynthesizedSpeech> {
      const apiKey = options.apiKey ?? process.env.ELEVENLABS_API_KEY;
      if (!apiKey) throw new TtsProviderError("ELEVENLABS_API_KEY is not configured.");

      const voiceId = options.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;
      const modelId = options.modelId ?? process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_MODEL_ID;

      const response = await fetchFn(
        `${ELEVENLABS_BASE_URL}/v1/text-to-speech/${voiceId}/stream`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "content-type": "application/json",
          },
          // No language_code: not all ElevenLabs models accept it, and the
          // multilingual default detects French from the text itself.
          body: JSON.stringify({
            text,
            model_id: modelId,
          }),
        },
      );

      if (!response.ok || response.body === null) {
        throw new TtsProviderError(`Speech synthesis failed with status ${response.status}.`);
      }

      return {
        audio: response.body,
        contentType: response.headers.get("content-type") ?? "audio/mpeg",
      };
    },
  };
}
