import { describe, expect, it } from "vitest";

import type { CheckInHistoryRecord } from "./historyTypes";
import { getRecentBatteryTrail } from "./historyView";

const createRecord = (
  createdAt: string,
  overrides: Partial<CheckInHistoryRecord> = {}
): CheckInHistoryRecord => ({
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
  createdAt,
  ...overrides
});

describe("historyView", () => {
  it("builds a seven-day battery trail with spectrum polarity", () => {
    const trail = getRecentBatteryTrail(
      [
        createRecord("2026-06-10T09:00:00", {
          moodTag: "energized",
          derivedUserState: {
            ...createRecord("2026-06-10T09:00:00").derivedUserState,
            mood: "bright",
            energyLevel: "full"
          }
        }),
        createRecord("2026-06-09T09:00:00", {
          derivedUserState: {
            ...createRecord("2026-06-09T09:00:00").derivedUserState,
            energyLevel: "low"
          }
        }),
        createRecord("2026-06-04T09:00:00", {
          derivedUserState: {
            ...createRecord("2026-06-04T09:00:00").derivedUserState,
            energyLevel: "critical"
          }
        })
      ],
      new Date("2026-06-10T12:00:00")
    );

    expect(trail.map((day) => day.dateKey)).toEqual([
      "2026-06-04",
      "2026-06-05",
      "2026-06-06",
      "2026-06-07",
      "2026-06-08",
      "2026-06-09",
      "2026-06-10"
    ]);
    expect(trail.map((day) => day.polarity)).toEqual([
      "crit",
      "empty",
      "empty",
      "empty",
      "empty",
      "low",
      "pos"
    ]);
  });

  it("uses calm polarity for non-low non-positive days", () => {
    const trail = getRecentBatteryTrail(
      [createRecord("2026-06-10T09:00:00")],
      new Date("2026-06-10T12:00:00")
    );

    expect(trail[6]).toMatchObject({
      energyLevel: "normal",
      polarity: "calm"
    });
  });

  it("uses the latest check-in polarity when a day has multiple records", () => {
    const trail = getRecentBatteryTrail(
      [
        createRecord("2026-06-10T08:00:00"),
        createRecord("2026-06-10T20:00:00", {
          derivedUserState: {
            ...createRecord("2026-06-10T20:00:00").derivedUserState,
            energyLevel: "critical"
          }
        })
      ],
      new Date("2026-06-10T21:00:00")
    );

    expect(trail[6]).toMatchObject({
      energyLevel: "critical",
      polarity: "crit"
    });
  });
});
