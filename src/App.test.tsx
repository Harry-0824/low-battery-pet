import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { saveCheckInRecord } from "./features/history/historyStorage";
import type { CheckInHistoryRecord } from "./features/history/historyTypes";

const createHistoryRecord = (
  createdAt: string,
  energyLevel: CheckInHistoryRecord["derivedUserState"]["energyLevel"] = "low"
): CheckInHistoryRecord => ({
  moodTag: "lonely",
  contextTags: ["want_to_rest"],
  shortText: "Need a small plan",
  derivedUserState: {
    mood: "lonely",
    energyLevel,
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
    reply: "孤單的夜晚會比較重。我在這裡，你不用努力表現得很好。",
    petLine: "我會在你旁邊留一盞小燈。",
    tinyAction: "設一個 10 分鐘不用產出的休息，把手機螢幕朝下。",
    tone: "warm",
    note: "Need a small plan"
  },
  createdAt
});

const getDateDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString();
};

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
    expect(screen.getByRole("button", { name: "很煩" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "有點孤單" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "腦袋空白" })).toBeTruthy();
  });

  it("initially has no selected mood and disables submit with helper text", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "還行" }).getAttribute("aria-pressed")).toBe(
      "false"
    );
    expect(screen.getByRole("button", { name: "快沒電" }).getAttribute("aria-pressed")).toBe(
      "false"
    );
    expect((screen.getByRole("button", { name: "讓小電量獸接住我" }) as HTMLButtonElement).disabled).toBe(
      true
    );
    expect(screen.getByText("先選一個今天的電量")).toBeTruthy();
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
    expect(within(result).getByTestId("pixel-pet-visual").getAttribute("data-visual-state")).toBe(
      "drained"
    );
    expect(within(result).getByText("( x_x )")).toBeTruthy();
    expect(within(result).getByText("小電量獸快沒電了")).toBeTruthy();
    expect(screen.getByText("牠說")).toBeTruthy();
    expect(screen.getByText("今天先不要跑太遠。我會趴在充電線旁邊等你。")).toBeTruthy();
    expect(screen.getByText("一件小事")).toBeTruthy();
    expect(screen.getByText("只看一眼下一個到期日，看完就讓它先躺著。")).toBeTruthy();
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

  it("clears note, mood, and context selections after submit", () => {
    render(<App />);

    const noteInput = screen.getByLabelText("想丟進樹洞的話");
    const moodButton = screen.getByRole("button", { name: "快沒電" });
    const contextButton = screen.getByRole("button", { name: "錢包壓力" });

    fireEvent.change(noteInput, {
      target: { value: "Need a small plan" }
    });
    fireEvent.click(moodButton);
    fireEvent.click(contextButton);
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect((noteInput as HTMLTextAreaElement).value).toBe("");
    expect(moodButton.getAttribute("aria-pressed")).toBe("false");
    expect(contextButton.getAttribute("aria-pressed")).toBe("false");
    expect((screen.getByRole("button", { name: "讓小電量獸接住我" }) as HTMLButtonElement).disabled).toBe(
      true
    );
    expect(screen.getByText("先選一個今天的電量")).toBeTruthy();
    expect(screen.getByTestId("check-in-result")).toBeTruthy();
  });

  it("shows an empty history state when no records exist", () => {
    render(<App />);

    expect(screen.getByText("最近被接住的時候")).toBeTruthy();
    expect(screen.getByText("樹洞還空著")).toBeTruthy();
    expect(screen.getByText(/選一個電量、需要的話留一句話/)).toBeTruthy();
  });

  it("shows a gentle first-use companion-days message with no history", () => {
    render(<App />);

    expect(screen.getByTestId("companion-days").textContent).toBe(
      "小電量獸今天先在旁邊待機，等你想靠近再開始。"
    );
  });

  it("shows first-use guidance before the first check-in", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "第一次靠近小電量獸" })).toBeTruthy();
    expect(screen.getByText("先選一個最像今天的電量。")).toBeTruthy();
    expect(screen.getByText("有卡住的事可以點一下，也可以把樹洞留空。")).toBeTruthy();
    expect(screen.getByText("送出後，牠會留一句話和一個很小的行動。")).toBeTruthy();
  });

  it("hides first-use guidance after a check-in", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "還行" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect(screen.queryByRole("heading", { name: "第一次靠近小電量獸" })).toBeNull();
  });

  it("shows companion days from unique check-in dates", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-08T11:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-09T10:00:00.000Z"));

    render(<App />);

    expect(screen.getByTestId("companion-days").textContent).toBe("小電量獸陪你 2 天了");
  });

  it("shows a tiny pet state memory from recent local history", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z", "critical"));
    saveCheckInRecord(createHistoryRecord("2026-06-09T10:00:00.000Z", "low"));

    render(<App />);

    expect(screen.getByTestId("pet-state-memory").textContent).toBe(
      "最近好像常常在省電模式。小電量獸會把燈開小一點，陪你慢慢待著。"
    );
  });

  it("shows a soft recent seven-day battery trail from local history", () => {
    saveCheckInRecord(createHistoryRecord(getDateDaysAgo(2), "critical"));
    saveCheckInRecord(createHistoryRecord(getDateDaysAgo(1), "low"));
    saveCheckInRecord(createHistoryRecord(getDateDaysAgo(0), "normal"));

    render(<App />);

    const trail = screen.getByTestId("battery-trail");
    expect(screen.getByText("最近 7 天的小電量足跡")).toBeTruthy();
    expect(screen.getByText("有記錄的日子會亮一下，空白也沒關係。")).toBeTruthy();
    expect(within(trail).getAllByTestId("battery-trail-day")).toHaveLength(7);
    expect(within(trail).getByText("快沒電")).toBeTruthy();
    expect(within(trail).getByText("低電量")).toBeTruthy();
    expect(within(trail).getByText("有一點亮")).toBeTruthy();
  });

  it("loads saved history records newest first with localized summaries", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord("2026-06-08T11:00:00.000Z"));

    render(<App />);

    const historyCards = screen.getAllByTestId("history-card");
    expect(historyCards[0].textContent).toContain("有點孤單・想躺著");
    expect(historyCards[0].textContent).toContain("小電量獸躲到角落");
    expect(historyCards[0].textContent).toContain("孤單的夜晚會比較重。");
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

    fireEvent.click(screen.getByRole("button", { name: "放下這些紀錄" }));

    expect(screen.queryByTestId("history-card")).toBeNull();
    expect(screen.getByText("紀錄已經放下了")).toBeTruthy();
    expect(screen.getByText("這裡先變安靜。下一次想回來時，可以重新留下今天的電量。")).toBeTruthy();
  });

  it("adds a submitted check-in to the visible history list", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "還行" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect(screen.getByTestId("history-card").textContent).toContain("還行");
  });
});
