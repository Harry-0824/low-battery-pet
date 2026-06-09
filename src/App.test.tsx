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
  it("renders localized app content inside the retro device screen", () => {
    render(<App />);

    const deviceScreen = screen.getByTestId("retro-device-screen");

    expect(screen.getByText("小電量獸")).toBeTruthy();
    expect(within(deviceScreen).getByText("今天電量如何？")).toBeTruthy();
    expect(within(deviceScreen).getByLabelText("想丟進樹洞的話")).toBeTruthy();
    expect(within(deviceScreen).getByText("最近被接住的時候")).toBeTruthy();
  });

  it("renders mood options", () => {
    render(<App />);

    expect(screen.getByText("今天電量如何？")).toBeTruthy();
    expect(screen.getByRole("button", { name: "還行" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "快沒電" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "有點煩" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "有點孤單" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "腦袋空白" })).toBeTruthy();
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

    const walletButton = screen.getByRole("button", { name: "錢包壓力" });
    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("submits the check-in and displays a user-facing text pet result", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));
    fireEvent.click(screen.getByRole("button", { name: "錢包壓力" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    const result = screen.getByTestId("check-in-result");
    expect(within(result).getByText("( x_x )")).toBeTruthy();
    expect(within(result).getByText("小電量獸快沒電了")).toBeTruthy();
    expect(screen.getByText("牠說")).toBeTruthy();
    expect(screen.getByText("一件小事")).toBeTruthy();
    expect(screen.queryByText("State preview")).toBeNull();
    expect(screen.queryByText("Derived user state")).toBeNull();
    expect(screen.queryByText("Pet state")).toBeNull();
    expect(screen.queryByText("Tone")).toBeNull();
  });

  it("accepts optional text without showing note debug output", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("想丟進樹洞的話"), {
      target: { value: "Need a small plan" }
    });
    fireEvent.click(screen.getByRole("button", { name: "有點孤單" }));
    fireEvent.click(screen.getByRole("button", { name: "想躺著" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect(screen.getByText("牠說")).toBeTruthy();
    expect(screen.getByText("一件小事")).toBeTruthy();
    expect(screen.queryByText("Tone: warm")).toBeNull();
    expect(screen.queryByText("Note: Need a small plan")).toBeNull();
  });

  it("shows an empty history state when no records exist", () => {
    render(<App />);

    expect(screen.getByText("最近被接住的時候")).toBeTruthy();
    expect(screen.getByText("還沒有被接住的紀錄。")).toBeTruthy();
  });

  it("loads saved history records newest first with localized summaries", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-08T11:00:00.000Z"));

    render(<App />);

    const historyCards = screen.getAllByTestId("history-card");
    expect(historyCards[0].textContent).toContain("有點孤單・想躺著");
    expect(historyCards[0].textContent).toContain("小電量獸躲到角落");
    expect(historyCards[0].textContent).toContain("Lonely evenings feel heavier.");
    expect(historyCards[0].textContent).not.toContain("2026-06-08T11:00:00.000Z");
    expect(historyCards[0].textContent).not.toContain("moodTag:");
    expect(historyCards[0].textContent).not.toContain("contexts:");
    expect(historyCards[0].textContent).not.toContain("pet:");
  });

  it("limits visible history records to the three most recent records", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-08T11:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-08T12:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-08T13:00:00.000Z"));

    render(<App />);

    expect(screen.getAllByTestId("history-card")).toHaveLength(3);
  });

  it("clears saved history and updates the visible history state", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "清空紀錄" }));

    expect(screen.queryByTestId("history-card")).toBeNull();
    expect(screen.getByText("還沒有被接住的紀錄。")).toBeTruthy();
  });

  it("adds a submitted check-in to the visible history list", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect(screen.getByTestId("history-card").textContent).toContain("還行");
  });
});
