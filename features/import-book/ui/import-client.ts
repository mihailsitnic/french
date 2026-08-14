import type { ImportRequest, ImportResult } from "../application/import-book";

const FALLBACK_ERROR = {
  code: "TRANSLATION_FAILED",
  message: "We couldn't import this text. Please try again.",
} as const;

/** Browser-side client for the import route; the UI depends on its shape, not on fetch. */
export async function importBookViaApi(request: ImportRequest): Promise<ImportResult> {
  try {
    const response = await fetch("/api/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });
    const data: unknown = await response.json();

    if (isImportResult(data)) return data;
    return { ok: false, error: FALLBACK_ERROR };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}

function isImportResult(data: unknown): data is ImportResult {
  if (typeof data !== "object" || data === null || !("ok" in data)) return false;
  if (data.ok === true) return "documentId" in data && typeof data.documentId === "string";
  return (
    data.ok === false &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "message" in data.error
  );
}
