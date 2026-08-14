import { z } from "zod";
import type { ImportErrorCode } from "@/features/import-book/application/import-book";
import { getServices } from "@/lib/server/services";

const ImportRequestSchema = z.object({
  text: z.string(),
  sourceLanguage: z.enum(["fr", "en"]),
});

const STATUS_BY_ERROR: Record<ImportErrorCode, number> = {
  INVALID_REQUEST: 400,
  EMPTY_INPUT: 400,
  INPUT_TOO_LARGE: 413,
  TRANSLATION_FAILED: 502,
};

export async function POST(request: Request) {
  const body = ImportRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return Response.json(
      { ok: false, error: { code: "INVALID_REQUEST", message: "The import request was invalid." } },
      { status: 400 },
    );
  }

  const result = await getServices().importBook(body.data);
  if (!result.ok) {
    return Response.json(result, { status: STATUS_BY_ERROR[result.error.code] });
  }
  return Response.json(result);
}
