"use client";

import { useRef, type MouseEvent } from "react";
import type { BilingualDocument } from "@/features/import-book/domain/bilingual-document";
import {
  createPronunciationPlayer,
  type PronunciationPlayer,
} from "@/features/pronunciation/ui/pronunciation-player";
import styles from "./ReaderView.module.scss";

type Props = {
  document: BilingualDocument;
  /** Injectable for tests; defaults to the shared streaming player. */
  player?: PronunciationPlayer;
};

/**
 * Renders a bilingual document as flowing prose: each segment is one unit
 * with French on top and English underneath. Hover highlighting is pure CSS
 * on the shared unit, and clicks are handled by a single delegated listener
 * rather than one handler per word.
 */
export function ReaderView({ document, player }: Props) {
  const playerRef = useRef<PronunciationPlayer | null>(player ?? null);

  function handleClick(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    const french = target.closest("button");
    if (!french || !french.textContent) return;

    playerRef.current ??= createPronunciationPlayer();
    void playerRef.current.play(french.textContent);
  }

  return (
    <article className={styles.reader} onClick={handleClick}>
      {document.paragraphs.map((paragraph) => (
        <p key={paragraph.id} className={styles.paragraph}>
          {paragraph.segments.map((segment) => (
            <span key={segment.id} className={styles.segment}>
              <button type="button" lang="fr" className={styles.french}>
                {segment.french}
              </button>
              <span lang="en" className={styles.english}>
                {segment.english}
              </span>
            </span>
          ))}
        </p>
      ))}
    </article>
  );
}
