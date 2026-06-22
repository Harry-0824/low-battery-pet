import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import {
  CHECK_IN_HISTORY_LIMIT_HINT_THRESHOLD,
  loadCheckInHistory,
  saveCheckInRecord
} from "./features/history/historyStorage";
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

const getDateHoursAgo = (hoursAgo: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);

  return date.toISOString();
};

const scrollIntoViewMock = vi.fn();

const createMatchMediaMock = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));

beforeEach(() => {
  localStorage.clear();
  scrollIntoViewMock.mockReset();
  Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scrollIntoViewMock
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: createMatchMediaMock(false)
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
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
    expect(screen.getByText("先選一個最像今天的電量")).toBeTruthy();
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

    const walletButton = screen.getByRole("button", { name: "錢包有壓力" });
    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("keeps the lonely mood and rest context visibly selected through aria state", () => {
    render(<App />);

    const lonelyButton = screen.getByRole("button", { name: "有點孤單" });
    const restButton = screen.getByRole("button", { name: "想躺著" });

    fireEvent.click(lonelyButton);
    fireEvent.click(restButton);

    expect(lonelyButton.getAttribute("aria-pressed")).toBe("true");
    expect(restButton.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "還行" }).getAttribute("aria-pressed")).toBe(
      "false"
    );
  });

  it("submits the check-in and displays a user-facing text pet result", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));
    fireEvent.click(screen.getByRole("button", { name: "錢包有壓力" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    const result = screen.getByTestId("check-in-result");
    expect(within(result).getByTestId("pixel-pet-visual").getAttribute("data-visual-state")).toBe(
      "drained"
    );
    expect(within(result).getByText("( x_x )")).toBeTruthy();
    expect(within(result).getByText("小電量獸快沒電了")).toBeTruthy();
    expect(screen.getByText("牠說")).toBeTruthy();
    expect(
      screen.getByText("錢包壓力和低電量一起來時，先不用解決全部；我們先守住今天最小的一步。")
    ).toBeTruthy();
    expect(screen.getByText("一件小事")).toBeTruthy();
    expect(screen.getByText("只看一眼下一個到期日，看完就讓它先躺著。")).toBeTruthy();
    expect(screen.queryByText("State preview")).toBeNull();
    expect(screen.queryByText("Derived user state")).toBeNull();
    expect(screen.queryByText("Pet state")).toBeNull();
    expect(screen.queryByText("Tone")).toBeNull();
  });

  it("scrolls the submitted pet reply into view", () => {
    render(<App />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[buttons.length - 1]);

    expect(screen.getByTestId("check-in-result").getAttribute("aria-live")).toBe("polite");
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start"
    });
  });

  it("uses instant scrolling for the submitted reply when reduced motion is preferred", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: createMatchMediaMock(true)
    });
    render(<App />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[buttons.length - 1]);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start"
    });
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
    const contextButton = screen.getByRole("button", { name: "錢包有壓力" });

    fireEvent.change(noteInput, {
      target: { value: "Need a small plan" }
    });
    fireEvent.click(moodButton);
    fireEvent.click(contextButton);
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect((noteInput as HTMLTextAreaElement).value).toBe("");
    expect(moodButton.getAttribute("aria-pressed")).toBe("false");
    expect(contextButton.getAttribute("aria-pressed")).toBe("false");
    expect((screen.getByRole("button", { name: "收集中..." }) as HTMLButtonElement).disabled).toBe(
      true
    );
    expect(screen.getByText("小電量獸正在收集今天的一點點。")).toBeTruthy();
    expect(screen.getByTestId("check-in-result")).toBeTruthy();
  });

  it("briefly shows collecting feedback while keeping the submitted preview", () => {
    vi.useFakeTimers();
    render(<App />);

    const noteInput = screen.getByLabelText("想丟進樹洞的話");

    fireEvent.change(noteInput, {
      target: { value: "Need a small plan" }
    });
    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    const collectingButton = screen.getByRole("button", { name: "收集中..." });
    expect((collectingButton as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("小電量獸正在收集今天的一點點。")).toBeTruthy();
    expect((noteInput as HTMLTextAreaElement).value).toBe("");
    expect(screen.getByTestId("check-in-result")).toBeTruthy();

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect((screen.getByRole("button", { name: "讓小電量獸接住我" }) as HTMLButtonElement).disabled).toBe(
      true
    );
    expect(screen.getByText("先選一個最像今天的電量")).toBeTruthy();
  });

  it("keeps submit feedback visible for about 900ms", () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect((screen.getByRole("button", { name: "收集中..." }) as HTMLButtonElement).disabled).toBe(
      true
    );

    act(() => {
      vi.advanceTimersByTime(899);
    });

    expect((screen.getByRole("button", { name: "收集中..." }) as HTMLButtonElement).disabled).toBe(
      true
    );

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect((screen.getByRole("button", { name: "讓小電量獸接住我" }) as HTMLButtonElement).disabled).toBe(
      true
    );
  });

  it("shows an empty history state when no records exist", () => {
    render(<App />);

    expect(screen.getByText("最近被接住的時候")).toBeTruthy();
    expect(screen.getByText("樹洞還空著")).toBeTruthy();
    expect(screen.getByText(/先選一個電量、需要的話留一句話/)).toBeTruthy();
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
    expect(screen.getByText("有卡住的地方可以點一下，也可以把樹洞留空。")).toBeTruthy();
    expect(screen.getByText("送出後，牠會留一句話和一個很小的行動。")).toBeTruthy();
  });

  it("shows a lighter empty battery trail before the first check-in", () => {
    render(<App />);

    const trail = screen.getByTestId("battery-trail");
    expect(screen.getByText("最近 7 天的小電量足跡")).toBeTruthy();
    expect(screen.getByText("7 天後這裡會慢慢亮起來，今天先留一點點就好。")).toBeTruthy();
    expect(within(trail).queryByTestId("battery-trail-day")).toBeNull();
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
    expect(screen.getByText("有紀錄的日子會亮一下，空白也可以慢慢來。")).toBeTruthy();
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

  it("shows a soft cleanup hint when local history is near the record limit", () => {
    for (let index = 0; index < CHECK_IN_HISTORY_LIMIT_HINT_THRESHOLD; index += 1) {
      saveCheckInRecord(
        createHistoryRecord(`2026-06-08T10:${String(index).padStart(2, "0")}:00.000Z`)
      );
    }

    render(<App />);

    expect(screen.getByText("只保留最近 30 筆，舊的會先睡進角落。")).toBeTruthy();
    expect(screen.getAllByTestId("history-card")).toHaveLength(3);
  });

  it("does not show the cleanup hint before local history is near the record limit", () => {
    for (let index = 0; index < CHECK_IN_HISTORY_LIMIT_HINT_THRESHOLD - 1; index += 1) {
      saveCheckInRecord(
        createHistoryRecord(`2026-06-08T10:${String(index).padStart(2, "0")}:00.000Z`)
      );
    }

    render(<App />);

    expect(screen.queryByText("只保留最近 30 筆，舊的會先睡進角落。")).toBeNull();
  });

  it("clears saved history and updates the visible history state", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-08T10:00:00.000Z"));
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "放下這些紀錄" }));

    expect(screen.queryByTestId("history-card")).toBeNull();
    expect(screen.getByText("紀錄已經放下了")).toBeTruthy();
    expect(screen.getByText("這裡先變安靜。下一次想回來時，可以重新留下今天的電量。")).toBeTruthy();
  });

  it("deletes one local history day and keeps other days in sync", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));
    const firstTodayRecord = createHistoryRecord("2026-06-22T08:00:00", "low");
    const secondTodayRecord = createHistoryRecord("2026-06-22T10:00:00", "critical");
    const yesterdayRecord = createHistoryRecord("2026-06-21T10:00:00", "normal");
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    saveCheckInRecord(firstTodayRecord);
    saveCheckInRecord(secondTodayRecord);
    saveCheckInRecord(yesterdayRecord);
    render(<App />);

    expect(screen.getByTestId("companion-days").textContent).toBe("小電量獸陪你 2 天了");
    expect(within(screen.getByTestId("battery-trail")).getByText("快沒電")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: /清除 .* 的紀錄/ })[0]);

    expect(confirmSpy).toHaveBeenCalledWith("保留其他，只清這天？");
    expect(screen.getAllByTestId("history-card")).toHaveLength(1);
    expect(screen.getByTestId("history-card").textContent).toContain("6/21");
    expect(screen.getByTestId("companion-days").textContent).toBe("小電量獸陪你 1 天了");
    expect(within(screen.getByTestId("battery-trail")).queryByText("快沒電")).toBeNull();
    expect(within(screen.getByTestId("battery-trail")).getByText("有一點亮")).toBeTruthy();
    expect(loadCheckInHistory()).toEqual([yesterdayRecord]);
  });

  it("shows the cleared empty state after deleting the last local history day", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    saveCheckInRecord(createHistoryRecord("2026-06-22T08:00:00", "low"));
    saveCheckInRecord(createHistoryRecord("2026-06-22T10:00:00", "critical"));
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: /清除 .* 的紀錄/ })[0]);

    expect(confirmSpy).toHaveBeenCalledWith("保留其他，只清這天？");
    expect(screen.queryByTestId("history-card")).toBeNull();
    expect(screen.getByText("紀錄已經放下了")).toBeTruthy();
    expect(screen.getByText("這裡先變安靜。下一次想回來時，可以重新留下今天的電量。")).toBeTruthy();
    expect(loadCheckInHistory()).toEqual([]);
  });

  it("adds a submitted check-in to the visible history list", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "還行" }));
    fireEvent.click(screen.getByRole("button", { name: "讓小電量獸接住我" }));

    expect(screen.getByTestId("history-card").textContent).toContain("還行");
  });

  it("only shows the follow-up prompt for the latest check-in from 6 to 12 hours ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00.000Z"));

    render(<App />);
    expect(screen.queryByText("小電量獸小聲問：剛剛那段時間，現在怎麼樣？")).toBeNull();
    cleanup();

    saveCheckInRecord(createHistoryRecord(getDateHoursAgo(5)));
    render(<App />);
    expect(screen.queryByText("小電量獸小聲問：剛剛那段時間，現在怎麼樣？")).toBeNull();
    cleanup();
    localStorage.clear();

    saveCheckInRecord(createHistoryRecord(getDateHoursAgo(8)));
    render(<App />);
    expect(screen.getByTestId("follow-up-reminder").getAttribute("aria-labelledby")).toBe(
      "follow-up-reminder-title"
    );
    expect(screen.getByText("小電量獸小聲問：剛剛那段時間，現在怎麼樣？")).toBeTruthy();
    expect(screen.getByRole("button", { name: "還是有點難" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "好一點點" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "還不知道" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "不想說" })).toBeTruthy();
    cleanup();
    localStorage.clear();

    saveCheckInRecord(createHistoryRecord(getDateHoursAgo(13)));
    render(<App />);
    expect(screen.queryByText("小電量獸小聲問：剛剛那段時間，現在怎麼樣？")).toBeNull();
  });

  it("keeps a selected follow-up option hidden for the same check-in after reload", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00.000Z"));
    saveCheckInRecord(createHistoryRecord(getDateHoursAgo(8)));

    const { unmount } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "好一點點" }));
    expect(screen.queryByText("小電量獸小聲問：剛剛那段時間，現在怎麼樣？")).toBeNull();

    unmount();
    render(<App />);

    expect(screen.queryByText("小電量獸小聲問：剛剛那段時間，現在怎麼樣？")).toBeNull();
  });

  it("keeps history card delete actions available by button role", () => {
    saveCheckInRecord(createHistoryRecord("2026-06-22T08:00:00", "low"));
    render(<App />);

    expect(screen.getByTestId("history-card")).toBeTruthy();
    expect(screen.getByRole("button", { name: /清除 .* 的紀錄/ })).toBeTruthy();
  });
});
