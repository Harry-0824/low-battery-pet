import { beforeEach, describe, expect, it } from "vitest";

import { deriveUserState } from "../checkIn/deriveUserState";
import { calculatePetState } from "../pet/petStateEngine";
import type { CheckInHistoryRecord } from "./historyTypes";
import {
  CHECK_IN_HISTORY_STORAGE_KEY,
  CHECK_IN_HISTORY_RECORD_LIMIT,
  clearCheckInHistory,
  deleteCheckInHistoryDay,
  getCompanionDayCount,
  getPetStateMemoryMessage,
  getRecentBatteryTrail,
  loadCheckInHistory,
  saveCheckInRecord
} from "./historyStorage";

type StoredCheckInHistoryRecord = CheckInHistoryRecord & { dataVersion: number };

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

const withDataVersion = (record: CheckInHistoryRecord): StoredCheckInHistoryRecord => ({
  ...record,
  dataVersion: 2
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
    expect(JSON.parse(localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY) ?? "[]")).toEqual([
      withDataVersion(newerRecord),
      withDataVersion(olderRecord)
    ]);
  });

  it("keeps only the latest history record limit", () => {
    for (let index = 0; index < CHECK_IN_HISTORY_RECORD_LIMIT + 5; index += 1) {
      saveCheckInRecord(createRecord(`2026-06-08T10:${String(index).padStart(2, "0")}:00.000Z`));
    }

    const records = loadCheckInHistory();

    expect(records).toHaveLength(CHECK_IN_HISTORY_RECORD_LIMIT);
    expect(records[0].createdAt).toBe("2026-06-08T10:34:00.000Z");
    expect(records[CHECK_IN_HISTORY_RECORD_LIMIT - 1].createdAt).toBe(
      "2026-06-08T10:05:00.000Z"
    );
  });

  it("clears all saved history records", () => {
    saveCheckInRecord(createRecord("2026-06-08T10:00:00.000Z"));

    clearCheckInHistory();

    expect(loadCheckInHistory()).toEqual([]);
    expect(localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY)).toBeNull();
  });

  it("deletes records from the same local day and keeps other days", () => {
    const firstSameDayRecord = createRecord("2026-06-08T10:00:00");
    const secondSameDayRecord = createRecord("2026-06-08T21:00:00", "low");
    const otherDayRecord = createRecord("2026-06-09T10:00:00", "normal");

    saveCheckInRecord(firstSameDayRecord);
    saveCheckInRecord(secondSameDayRecord);
    saveCheckInRecord(otherDayRecord);

    const records = deleteCheckInHistoryDay(firstSameDayRecord.createdAt);

    expect(records).toEqual([otherDayRecord]);
    expect(loadCheckInHistory()).toEqual([otherDayRecord]);
    expect(localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY)).toBe(
      JSON.stringify([withDataVersion(otherDayRecord)])
    );
  });

  it("removes the storage key when deleting the last local day", () => {
    saveCheckInRecord(createRecord("2026-06-08T10:00:00"));
    saveCheckInRecord(createRecord("2026-06-08T21:00:00", "low"));

    expect(deleteCheckInHistoryDay("2026-06-08T12:00:00")).toEqual([]);
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

  it("migrates legacy array records to dataVersion 2 and keeps companion day count", () => {
    const legacyRecord = {
      moodTag: "low_battery",
      contextTags: ["wallet_pressure"],
      shortText: "Need a quiet day",
      derivedUserState: deriveUserState({
        moodTag: "low_battery",
        contextTags: ["wallet_pressure"]
      }),
      companionReply: {
        reply: "Reply",
        petLine: "Pet line",
        tinyAction: "Tiny action",
        tone: "calm",
        note: "Small note"
      },
      createdAt: "2026-06-08T10:00:00.000Z"
    };
    const existingVersion2Record = withDataVersion(createRecord("2026-06-09T10:00:00.000Z"));

    localStorage.setItem(
      CHECK_IN_HISTORY_STORAGE_KEY,
      JSON.stringify([legacyRecord, existingVersion2Record])
    );

    const migratedRecords = loadCheckInHistory();

    expect(getCompanionDayCount(migratedRecords)).toBe(2);
    expect(migratedRecords).toEqual([
      createRecord("2026-06-09T10:00:00.000Z"),
      {
        ...legacyRecord,
        petState: calculatePetState(
          deriveUserState({
            moodTag: "low_battery",
            contextTags: ["wallet_pressure"]
          })
        )
      }
    ]);
    expect(JSON.parse(localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY) ?? "[]")).toEqual(
      migratedRecords.map(withDataVersion)
    );
  });

  it("migrates legacy version 1 payload records", () => {
    const legacyRecord = {
      moodTag: "annoyed",
      contextTags: ["work_stress"],
      shortText: "Too many tabs open",
      companionReply: {
        reply: "Reply",
        petLine: "Pet line",
        tinyAction: "Tiny action",
        tone: "calm"
      },
      createdAt: "2026-06-08T10:00:00.000Z"
    };

    localStorage.setItem(
      CHECK_IN_HISTORY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        payload: [legacyRecord]
      })
    );

    const migratedRecords = loadCheckInHistory();

    expect(migratedRecords).toEqual([
      {
        ...legacyRecord,
        contextTags: ["work_stress"],
        shortText: "Too many tabs open",
        derivedUserState: deriveUserState({
          moodTag: "annoyed",
          contextTags: ["work_stress"]
        }),
        petState: calculatePetState(
          deriveUserState({
            moodTag: "annoyed",
            contextTags: ["work_stress"]
          })
        )
      }
    ]);
    expect(JSON.parse(localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY) ?? "[]")).toEqual(
      migratedRecords.map(withDataVersion)
    );
  });

  it("keeps valid dataVersion 2 records as-is", () => {
    const record = withDataVersion(createRecord("2026-06-08T10:00:00.000Z", "low"));

    localStorage.setItem(CHECK_IN_HISTORY_STORAGE_KEY, JSON.stringify([record]));

    expect(loadCheckInHistory()).toEqual([createRecord("2026-06-08T10:00:00.000Z", "low")]);
    expect(JSON.parse(localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY) ?? "[]")).toEqual([
      record
    ]);
  });

  it("falls back to empty history when stored JSON is broken", () => {
    localStorage.setItem(CHECK_IN_HISTORY_STORAGE_KEY, "{broken");

    expect(loadCheckInHistory()).toEqual([]);
  });

  it("drops records missing moodTag or createdAt during migration", () => {
    const validRecord = {
      moodTag: "okay",
      contextTags: ["want_to_rest"],
      shortText: "Small note",
      derivedUserState: deriveUserState({
        moodTag: "okay",
        contextTags: ["want_to_rest"]
      }),
      companionReply: {
        reply: "Reply",
        petLine: "Pet line",
        tinyAction: "Tiny action",
        tone: "calm",
        note: "Small note"
      },
      createdAt: "2026-06-08T10:00:00.000Z"
    };

    localStorage.setItem(
      CHECK_IN_HISTORY_STORAGE_KEY,
      JSON.stringify([
        { ...validRecord, moodTag: undefined },
        { ...validRecord, createdAt: undefined },
        validRecord
      ])
    );

    expect(loadCheckInHistory()).toEqual([
      {
        ...validRecord,
        petState: calculatePetState(
          deriveUserState({
            moodTag: "okay",
            contextTags: ["want_to_rest"]
          })
        )
      }
    ]);
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

  it("does not show pet state memory before there is recent history to compare", () => {
    expect(getPetStateMemoryMessage([])).toBeNull();
    expect(getPetStateMemoryMessage([createRecord("2026-06-10T09:00:00", "low")])).toBeNull();
  });

  it("softly remembers when recent records are often low power", () => {
    expect(
      getPetStateMemoryMessage([
        createRecord("2026-06-10T09:00:00", "low"),
        createRecord("2026-06-09T09:00:00", "critical"),
        createRecord("2026-06-08T09:00:00", "normal")
      ])
    ).toBe("最近好像常常在省電模式。小電量獸會把燈開小一點，陪你慢慢待著。");
  });

  it("softly remembers when the user has recharged a little", () => {
    expect(
      getPetStateMemoryMessage([
        createRecord("2026-06-10T09:00:00", "normal"),
        createRecord("2026-06-09T09:00:00", "low")
      ])
    ).toBe("這幾天有稍微回充一點點。那一點點也會被小電量獸記得。");
  });
});
