import { beforeEach, describe, expect, it } from "vitest";

import type { CheckInHistoryRecord } from "./historyTypes";
import {
  CHECK_IN_HISTORY_STORAGE_KEY,
  clearCheckInHistory,
  getCompanionDayCount,
  getRecentBatteryTrail,
  loadCheckInHistory,
  saveCheckInRecord
} from "./historyStorage";

const createRecord = (
  createdAt: string,
  energyLevel: CheckInHistoryRecord["derivedUserState"]["energyLevel"] = "normal"
): CheckInHistoryRecord => ({
  moodTag: "okay",
  contextTags: ["want_to_rest"],
  shortText: "Small note",
  derivedUserState: {
    mood: "neutral",
    energyLevel,
    stressLevel: "low",
    needsComfort: false,
    hasWalletPressure: false,
    needsRest: true,
    needsFoodSuggestion: false
  },
  petState: {
    mood: "idle",
    animation: "idle",
    effect: "none",
    accessory: "none"
  },
  companionReply: {
    reply: "Reply",
    petLine: "Pet line",
    tinyAction: "Tiny action",
    tone: "calm",
    note: "Small note"
  },
  createdAt
});

describe("historyStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty list when no history exists", () => {
    expect(loadCheckInHistory()).toEqual([]);
  });

  it("saves check-in records and loads newest first", () => {
    const olderRecord = createRecord("2026-06-08T10:00:00.000Z");
    const newerRecord = createRecord("2026-06-08T11:00:00.000Z");

    saveCheckInRecord(olderRecord);
    saveCheckInRecord(newerRecord);

    expect(loadCheckInHistory()).toEqual([newerRecord, olderRecord]);
  });

  it("keeps only the latest 30 records", () => {
    for (let index = 0; index < 35; index += 1) {
      saveCheckInRecord(createRecord(`2026-06-08T10:${String(index).padStart(2, "0")}:00.000Z`));
    }

    const records = loadCheckInHistory();

    expect(records).toHaveLength(30);
    expect(records[0].createdAt).toBe("2026-06-08T10:34:00.000Z");
    expect(records[29].createdAt).toBe("2026-06-08T10:05:00.000Z");
  });

  it("clears all saved history records", () => {
    saveCheckInRecord(createRecord("2026-06-08T10:00:00.000Z"));

    clearCheckInHistory();

    expect(loadCheckInHistory()).toEqual([]);
    expect(localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY)).toBeNull();
  });

  it("counts unique local check-in days instead of total records", () => {
    const records = [
      createRecord("2026-06-08T10:00:00.000Z"),
      createRecord("2026-06-08T11:00:00.000Z"),
      createRecord("2026-06-09T10:00:00.000Z")
    ];

    expect(getCompanionDayCount(records)).toBe(2);
  });

  it("builds a seven-day battery trail ending on the reference date", () => {
    const trail = getRecentBatteryTrail(
      [
        createRecord("2026-06-10T09:00:00", "normal"),
        createRecord("2026-06-09T09:00:00", "low"),
        createRecord("2026-06-04T09:00:00", "critical"),
        createRecord("2026-06-03T09:00:00", "critical")
      ],
      new Date("2026-06-10T12:00:00")
    );

    expect(trail).toHaveLength(7);
    expect(trail.map((day) => day.dateKey)).toEqual([
      "2026-06-04",
      "2026-06-05",
      "2026-06-06",
      "2026-06-07",
      "2026-06-08",
      "2026-06-09",
      "2026-06-10"
    ]);
    expect(trail.map((day) => day.energyLevel)).toEqual([
      "critical",
      "empty",
      "empty",
      "empty",
      "empty",
      "low",
      "normal"
    ]);
  });

  it("uses the latest check-in when a day has multiple records", () => {
    const trail = getRecentBatteryTrail(
      [
        createRecord("2026-06-10T08:00:00", "normal"),
        createRecord("2026-06-10T20:00:00", "critical")
      ],
      new Date("2026-06-10T21:00:00")
    );

    expect(trail[6].energyLevel).toBe("critical");
  });
});
