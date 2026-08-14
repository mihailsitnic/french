import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImportResult } from "../application/import-book";
import { ImportDialog } from "./ImportDialog";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function renderDialog(importBook = vi.fn<() => Promise<ImportResult>>()) {
  importBook.mockResolvedValue({ ok: true, documentId: "doc-42" });
  render(<ImportDialog importBook={importBook} />);
  return { importBook };
}

async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /import/i }));
  return screen.getByRole("dialog");
}

beforeEach(() => {
  push.mockClear();
});

describe("ImportDialog", () => {
  it("renders the + Import trigger with an accessible name", () => {
    renderDialog();
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
  });

  it("opens an accessibly-titled dialog when + Import is clicked", async () => {
    const user = userEvent.setup();
    renderDialog();

    const dialog = await openDialog(user);

    expect(dialog).toBeVisible();
    expect(dialog).toHaveAccessibleName(/import/i);
  });

  it("moves focus into the dialog when it opens", async () => {
    const user = userEvent.setup();
    renderDialog();

    const dialog = await openDialog(user);

    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderDialog();
    const trigger = screen.getByRole("button", { name: /import/i });

    await openDialog(user);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes via the close button and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderDialog();
    const trigger = screen.getByRole("button", { name: /\+ import/i });

    await openDialog(user);
    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when clicking outside the dialog content (backdrop)", async () => {
    const user = userEvent.setup();
    renderDialog();

    const dialog = await openDialog(user);
    // A backdrop click targets the <dialog> element itself, not its children.
    await user.click(dialog);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open when clicking inside the dialog content", async () => {
    const user = userEvent.setup();
    renderDialog();

    await openDialog(user);
    await user.click(screen.getByRole("textbox"));

    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("defaults the direction to English → French, with the swap control between the languages", async () => {
    const user = userEvent.setup();
    renderDialog();

    await openDialog(user);

    const direction = screen.getByRole("group", { name: /direction/i });
    expect(direction).toHaveTextContent(/^English\s*French$/);
    expect(screen.getByRole("textbox")).toHaveAccessibleName("Paste English text");

    // the swap control sits between the two language labels
    const swap = screen.getByRole("button", { name: /swap/i });
    const english = screen.getByText("English");
    const french = screen.getByText("French");
    expect(english.compareDocumentPosition(swap) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(swap.compareDocumentPosition(french) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("swaps to French → English and back with an accessible control", async () => {
    const user = userEvent.setup();
    renderDialog();
    await openDialog(user);

    const direction = screen.getByRole("group", { name: /direction/i });
    const swap = screen.getByRole("button", { name: /swap/i });

    await user.click(swap);
    expect(direction).toHaveTextContent(/^French\s*English$/);

    await user.click(swap);
    expect(direction).toHaveTextContent(/^English\s*French$/);
  });

  it("spins the swap icon a further half turn to the right on every click", async () => {
    const user = userEvent.setup();
    renderDialog();
    await openDialog(user);

    const swap = screen.getByRole("button", { name: /swap/i });
    const icon = swap.querySelector("img");

    await user.click(swap);
    expect(icon).toHaveStyle({ transform: "rotate(180deg)" });

    await user.click(swap);
    expect(icon).toHaveStyle({ transform: "rotate(360deg)" });
  });

  it("disables Import for empty and whitespace-only input", async () => {
    const user = userEvent.setup();
    renderDialog();
    await openDialog(user);

    const importButton = screen.getByRole("button", { name: /^import$/i });
    expect(importButton).toBeDisabled();

    await user.type(screen.getByRole("textbox"), "   ");
    expect(importButton).toBeDisabled();
  });

  it("enables Import once meaningful text is entered", async () => {
    const user = userEvent.setup();
    renderDialog();
    await openDialog(user);

    await user.type(screen.getByRole("textbox"), "Il était une fois.");

    expect(screen.getByRole("button", { name: /^import$/i })).toBeEnabled();
  });

  it("imports English input as en → fr by default", async () => {
    const user = userEvent.setup();
    const { importBook } = renderDialog();
    await openDialog(user);

    await user.type(screen.getByRole("textbox"), "Once upon a time.");
    await user.click(screen.getByRole("button", { name: /^import$/i }));

    expect(importBook).toHaveBeenCalledWith({
      text: "Once upon a time.",
      sourceLanguage: "en",
    });
  });

  it("imports French input as fr → en after swapping", async () => {
    const user = userEvent.setup();
    const { importBook } = renderDialog();
    await openDialog(user);

    await user.click(screen.getByRole("button", { name: /swap/i }));
    await user.type(screen.getByRole("textbox"), "Il était une fois.");
    await user.click(screen.getByRole("button", { name: /^import$/i }));

    expect(importBook).toHaveBeenCalledWith({
      text: "Il était une fois.",
      sourceLanguage: "fr",
    });
  });

  it("navigates to the reader page after a successful import", async () => {
    const user = userEvent.setup();
    renderDialog();
    await openDialog(user);

    await user.type(screen.getByRole("textbox"), "Il était une fois.");
    await user.click(screen.getByRole("button", { name: /^import$/i }));

    expect(push).toHaveBeenCalledWith("/reader/doc-42");
  });

  it("shows a loading state and prevents double submission", async () => {
    const user = userEvent.setup();
    let resolveImport!: (result: ImportResult) => void;
    const importBook = vi.fn(
      () => new Promise<ImportResult>((resolve) => (resolveImport = resolve)),
    );
    render(<ImportDialog importBook={importBook} />);
    await openDialog(user);

    await user.type(screen.getByRole("textbox"), "Il était une fois.");
    const importButton = screen.getByRole("button", { name: /^import$/i });
    await user.click(importButton);
    await user.click(importButton);

    expect(importBook).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /importing/i })).toBeDisabled();

    resolveImport({ ok: true, documentId: "doc-42" });
  });

  it("keeps the dialog open with the user's text when the import fails", async () => {
    const user = userEvent.setup();
    const importBook = vi.fn<() => Promise<ImportResult>>().mockResolvedValue({
      ok: false,
      error: { code: "TRANSLATION_FAILED", message: "We couldn't translate this text." },
    });
    render(<ImportDialog importBook={importBook} />);
    await openDialog(user);

    await user.type(screen.getByRole("textbox"), "Il était une fois.");
    await user.click(screen.getByRole("button", { name: /^import$/i }));

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByRole("textbox")).toHaveValue("Il était une fois.");
    expect(screen.getByText(/couldn't translate/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();

    // recoverable: the user can retry
    expect(screen.getByRole("button", { name: /^import$/i })).toBeEnabled();
  });
});
