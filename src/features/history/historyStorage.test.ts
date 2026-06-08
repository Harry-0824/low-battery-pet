import { beforeEach, describe, expect, it } from "vitest";

import type { CheckInHistoryRecord } from "./historyTypes";
import {
  CHECK_IN_HISTORY_STORAGE_KEY,
  clearCheckInHistory,
  loadCheckInHistory,
  saveCheckInRecord
} from "./historyStorage";

const createRecord = (createdAt: string): CheckInHistoryRecord => ({
  moodTag: "okay",
  contextTags: ["want_to_rest"],
  shortText: "Small note",
  derivedUserState: {
    mood: "neutral",
    energyLevel: "normal",
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
});
