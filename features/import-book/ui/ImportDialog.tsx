"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import type { Language } from "../domain/bilingual-document";
import type { ImportRequest, ImportResult } from "../application/import-book";
import { importBookViaApi } from "./import-client";
import styles from "./ImportDialog.module.scss";

type Props = {
  /** Injectable for tests; defaults to the /api/import client. */
  importBook?: (request: ImportRequest) => Promise<ImportResult>;
};

const LANGUAGE_LABELS: Record<Language, string> = {
  fr: "French",
  en: "English",
};

const TEXTAREA_LABELS: Record<Language, string> = {
  fr: "Paste French text",
  en: "Paste English text",
};

/**
 * The `+ Import` trigger and its modal. Uses the native <dialog> element for
 * semantics, focus containment and Escape handling; focus is returned to the
 * trigger explicitly so the behaviour is deterministic across browsers.
 */
export function ImportDialog({ importBook = importBookViaApi }: Props) {
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [open, setOpen] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState<Language>("en");
  // Accumulates so the icon always keeps spinning clockwise, half a turn per swap.
  const [swapRotation, setSwapRotation] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);

  function close() {
    setOpen(false);
    setErrorMessage(null);
    triggerRef.current?.focus();
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    // A click on the ::backdrop targets the <dialog> element itself;
    // clicks on the content target its children.
    if (event.target === dialogRef.current) close();
  }

  async function handleImport() {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await importBook({ text, sourceLanguage });
      if (result.ok) {
        router.push(`/reader/${result.documentId}`);
        setText("");
        setOpen(false);
      } else {
        setErrorMessage(result.error.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const canImport = text.trim() !== "" && !submitting;
  const targetLanguage: Language = sourceLanguage === "fr" ? "en" : "fr";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
      >
        + Import
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          aria-label="Import a book"
          onKeyDown={handleDialogKeyDown}
          onClick={handleDialogClick}
          onCancel={close}
          onClose={close}
        >
          <header className={styles.header}>
            <button
              type="button"
              className={styles.close}
              aria-label="Close dialog"
              onClick={close}
            >
              <img src="/x.svg" alt="close" />
            </button>

            <div
              className={styles.direction}
              role="group"
              aria-label="Translation direction"
              aria-live="polite"
            >
              <span className={styles.language}>
                {LANGUAGE_LABELS[sourceLanguage]}
              </span>
              <button
                type="button"
                className={styles.swap}
                aria-label="Swap languages"
                onClick={() => {
                  setSourceLanguage((current) =>
                    current === "fr" ? "en" : "fr",
                  );
                  setSwapRotation((angle) => angle + 180);
                }}
              >
                <img
                  src="/arrows.svg"
                  alt=""
                  className={styles.swapIcon}
                  style={{ transform: `rotate(${swapRotation}deg)` }}
                />
              </button>
              <span className={styles.language}>
                {LANGUAGE_LABELS[targetLanguage]}
              </span>
            </div>
          </header>

          <div className={styles.content}>
            <textarea
              className={styles.textarea}
              aria-label={TEXTAREA_LABELS[sourceLanguage]}
              placeholder={`${TEXTAREA_LABELS[sourceLanguage]} from a book…`}
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={12}
              autoFocus
            />

            {errorMessage && (
              <p role="alert" className={styles.error}>
                {errorMessage}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={close}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.import}
              disabled={!canImport}
              onClick={handleImport}
            >
              {submitting ? "Importing…" : "Import"}
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
