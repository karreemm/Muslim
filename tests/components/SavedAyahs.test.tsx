import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SavedAyahsProvider, useSavedAyahs } from "@/context/features/SavedAyahsContext";
import { STORAGE_KEYS } from "@/lib/storage";

const makeAyah = (text: string) => ({
  surahNameEn: "Al-Baqara",
  surahNameAr: "البقرة",
  ayahNumberEn: 255,
  ayahNumberAr: "٢٥٥",
  text,
  SurahNumber: 2,
});

function Probe() {
  const { savedAyahs, saveAyah } = useSavedAyahs();

  return (
    <div>
      <span data-testid="count">{savedAyahs.length}</span>
      <span data-testid="text">{savedAyahs[0]?.text ?? ""}</span>
      <button onClick={() => saveAyah(makeAyah("first"))}>save first</button>
      <button onClick={() => saveAyah(makeAyah("second"))}>save second</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <SavedAyahsProvider>
      <Probe />
    </SavedAyahsProvider>,
  );
}

describe("SavedAyahsProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps one copy per ayah and stores the latest text", async () => {
    renderProbe();

    await userEvent.click(screen.getByRole("button", { name: "save first" }));
    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));

    await userEvent.click(screen.getByRole("button", { name: "save second" }));

    await waitFor(() => expect(screen.getByTestId("text")).toHaveTextContent("second"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("drops duplicates already present in storage", async () => {
    localStorage.setItem(
      STORAGE_KEYS.savedAyahs,
      JSON.stringify([makeAyah("old"), makeAyah("new")]),
    );

    renderProbe();

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));
    expect(screen.getByTestId("text")).toHaveTextContent("new");
  });
});
