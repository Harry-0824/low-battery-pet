import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { saveCheckInRecord } from "./features/history/historyStorage";
import type { CheckInHistoryRecord } from "./features/history/historyTypes";

const createHistoryRecord = (createdAt: string): CheckInHistoryRecord => ({
  moodTag: "lonely",
  contextTags: ["want_to_rest"],
  shortText: "Need a small plan",
  derivedUserState: {
    mood: "lonely",
    energyLevel: "low",
    stressLevel: "medium",
    needsComfort: true,
    hasWalletPressure: false,
    needsRest: true,
    needsFoodSuggestion: false
  },
  petState: {
    mood: "lonely",
    animation: "hide",
    effect: "rain",
    accessory: "none"
  },
  companionReply: {
    reply: "Lonely evenings feel heavier. I am here, and you do not have to perform.",
    petLine: "I will keep the little light on beside you.",
    tinyAction: "Set a 10 minute no-output rest block and put the phone face down.",
    tone: "warm",
    note: "Need a small plan"
  },
  createdAt
});

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders existing app content inside the retro device screen", () => {
    render(<App />);

    const deviceScreen = screen.getByTestId("retro-device-screen");

    expect(screen.getByText("LOW BATTERY PET")).toBeTruthy();
    expect(within(deviceScreen).getByText("Low Battery Pet")).toBeTruthy();
    expect(within(deviceScreen).getByLabelText("Optional check-in note")).toBeTruthy();
    expect(within(deviceScreen).getByText("Check-in history")).toBeTruthy();
  });

  it("renders mood options", () => {
    render(<App />);

    expect(screen.getByText("Low Battery Pet")).toBeTruthy();
    expect(screen.getByRole("button", { name: "還行" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "快沒電" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "很煩" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "有點孤單" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "不想思考" })).toBeTruthy();
  });

  it("lets the user select one mood option", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));

    expect(screen.getByRole("button", { name: "快沒電" }).getAttribute("aria-pressed")).toBe(
      "true"
    );
    expect(screen.getByRole("button", { name: "還行" }).getAttribute("aria-pressed")).toBe(
      "false"
    );
  });

  it("lets the user toggle a context tag", () => {
    render(<App />);

    const walletButton = screen.getByRole("button", { name: "錢包危險" });
    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("submits the check-in and displays derived user and pet state previews", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));
    fireEvent.click(screen.getByRole("button", { name: "錢包危險" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview state" }));

    expect(screen.getByText("Selected mood: low_battery")).toBeTruthy();
    expect(screen.getByText("Selected contexts: wallet_pressure")).toBeTruthy();
    expect(screen.getByText("energyLevel: critical")).toBeTruthy();
    expect(screen.getByText("hasWalletPressure: true")).toBeTruthy();
    expect(screen.getByText("mood: low_power")).toBeTruthy();
    expect(screen.getByText("effect: low_battery")).toBeTruthy();
  });

  it("accepts optional text and displays a companion reply preview", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Optional check-in note"), {
      target: { value: "Need a small plan" }
    });
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[9]);
    fireEvent.click(screen.getByRole("button", { name: "Preview state" }));

    expect(screen.getByText("Tone: warm")).toBeTruthy();
    expect(screen.getByText("Pet line: I will keep the little light on beside you.")).toBeTruthy();
    expect(
      screen.getByText(
        "Tiny action: Set a 10 minute no-output rest block and put the phone face down."
      )
    ).toBeTruthy();
    expect(screen.getByText("Note: Need a small plan")).toBeTruthy();
  });

  it("shows an empty history state when no records exist", () => {
    render(<App />);

    expect(screen.getByText("Check-in history")).toBeTruthy();
    expect(screen.getByText("No saved check-ins yet.")).toBeTruthy();
  });

  it("loads saved history records newest first", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-08T11:00:00.000Z"));

    render(<App />);

    const historyCards = screen.getAllByTestId("history-card");
    expect(historyCards[0].textContent).toContain("2026-06-08T11:00:00.000Z");
    expect(historyCards[0].textContent).toContain("moodTag: lonely");
    expect(historyCards[0].textContent).toContain("contexts: want_to_rest");
    expect(historyCards[0].textContent).toContain("pet: lonely / rain");
    expect(historyCards[0].textContent).toContain("reply: Lonely evenings feel heavier.");
  });

  it("clears saved history and updates the visible history state", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Clear history" }));

    expect(screen.queryByTestId("history-card")).toBeNull();
    expect(screen.getByText("No saved check-ins yet.")).toBeTruthy();
  });

  it("adds a submitted check-in to the visible history list", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Preview state" }));

    expect(screen.getByTestId("history-card").textContent).toContain("moodTag: okay");
  });
});
