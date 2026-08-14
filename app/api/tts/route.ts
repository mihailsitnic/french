import { handleTtsRequest } from "@/features/pronunciation/application/tts-request";
import { getServices } from "@/lib/server/services";

export async function GET(request: Request) {
  return handleTtsRequest(request, getServices().textToSpeech);
}
