import { describe, expect, it } from "vitest";

import { deriveUserState } from "./deriveUserState";
import type { CheckInInput, ContextTag, MoodTag } from "./checkInTypes";

const createInput = (
  moodTag: MoodTag,
  contextTags: ContextTag[] = []
): CheckInInput => ({
  moodTag,
  contextTags
});

describe("deriveUserState", () => {
  const moodCases: Array<{
    moodTag: MoodTag;
    expected: {
      mood: string;
      energyLevel: string;
      stressLevel: string;
      needsComfort: boolean;
    };
  }> = [
    {
      moodTag: "okay",
      expected: {
        mood: "neutral",
        energyLevel: "normal",
        stressLevel: "low",
        needsComfort: false
      }
    },
    {
      moodTag: "low_battery",
      expected: {
        mood: "tired",
        energyLevel: "critical",
        stressLevel: "medium",
        needsComfort: true
      }
    },
    {
      moodTag: "annoyed",
      expected: {
        mood: "angry",
        energyLevel: "low",
        stressLevel: "high",
        needsComfort: true
      }
    },
    {
      moodTag: "lonely",
      expected: {
        mood: "lonely",
        energyLevel: "low",
        stressLevel: "medium",
        needsComfort: true
      }
    },
    {
      moodTag: "no_thoughts",
      expected: {
        mood: "overloaded",
        energyLevel: "low",
        stressLevel: "medium",
        needsComfort: true
      }
    }
  ];

  it.each(moodCases)("maps $moodTag to the expected derived user state", ({ moodTag, expected }) => {
    expect(deriveUserState(createInput(moodTag))).toMatchObject(expected);
  });

  it("marks wallet pressure when the wallet_pressure context tag is present", () => {
    expect(deriveUserState(createInput("okay", ["wallet_pressure"]))).toMatchObject({
      hasWalletPressure: true
    });
  });

  it("raises stress to high when the work_stress context tag is present", () => {
    expect(deriveUserState(createInput("okay", ["work_stress"]))).toMatchObject({
      stressLevel: "high"
    });
  });

  it.each([
    "social_fatigue",
    "want_to_rest"
  ] satisfies ContextTag[])("marks rest as needed for the %s context tag", (contextTag) => {
    expect(deriveUserState(createInput("okay", [contextTag]))).toMatchObject({
      needsRest: true
    });
  });

  it("marks food suggestions as needed for the dinner_problem context tag", () => {
    expect(deriveUserState(createInput("okay", ["dinner_problem"]))).toMatchObject({
      needsFoodSuggestion: true
    });
  });
});
