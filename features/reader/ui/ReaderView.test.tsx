import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BilingualDocument } from "@/features/import-book/domain/bilingual-document";
import { ReaderView } from "./ReaderView";

const frenchSourceDocument: BilingualDocument = {
  id: "doc-1",
  sourceLanguage: "fr",
  paragraphs: [
    {
      id: "p1",
      segments: [
        { id: "p1-s1", french: "Il y avait une fois", english: "Once upon a time there was" },
        { id: "p1-s2", french: "un roi.", english: "a king." },
      ],
    },
    {
      id: "p2",
      segments: [{ id: "p2-s1", french: "Elle s'en rendit compte.", english: "She realised it." }],
    },
  ],
};

const englishSourceDocument: BilingualDocument = {
  ...frenchSourceDocument,
  id: "doc-2",
  sourceLanguage: "en",
};

describe("ReaderView", () => {
  it("renders French above English inside one shared segment unit", () => {
    render(<ReaderView document={frenchSourceDocument} />);

    const french = screen.getByRole("button", { name: "un roi." });
    const english = screen.getByText("a king.");

    expect(french.parentElement).toBe(english.parentElement);
    expect(
      french.compareDocumentPosition(english) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("keeps French on top even when the source input was English", () => {
    render(<ReaderView document={englishSourceDocument} />);

    const french = screen.getByRole("button", { name: "Elle s'en rendit compte." });
    const english = screen.getByText("She realised it.");

    expect(french.parentElement).toBe(english.parentElement);
    expect(
      french.compareDocumentPosition(english) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("marks each side with its language for assistive tech and styling", () => {
    render(<ReaderView document={frenchSourceDocument} />);

    expect(screen.getByRole("button", { name: "un roi." })).toHaveAttribute("lang", "fr");
    expect(screen.getByText("a king.")).toHaveAttribute("lang", "en");
  });

  it("renders one paragraph element per source paragraph", () => {
    render(<ReaderView document={frenchSourceDocument} />);

    const paragraphs = screen.getAllByRole("paragraph");
    expect(paragraphs).toHaveLength(2);
  });

  it("requests pronunciation of the clicked French phrase", async () => {
    const user = userEvent.setup();
    const play = vi.fn().mockResolvedValue(undefined);
    render(<ReaderView document={frenchSourceDocument} player={{ play }} />);

    await user.click(screen.getByRole("button", { name: "Il y avait une fois" }));

    expect(play).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledWith("Il y avait une fois");
  });

  it("does not request pronunciation when English text is clicked", async () => {
    const user = userEvent.setup();
    const play = vi.fn().mockResolvedValue(undefined);
    render(<ReaderView document={frenchSourceDocument} player={{ play }} />);

    await user.click(screen.getByText("Once upon a time there was"));

    expect(play).not.toHaveBeenCalled();
  });
});
