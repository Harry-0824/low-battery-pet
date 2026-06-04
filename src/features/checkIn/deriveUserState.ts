import type {
  CheckInInput,
  DerivedUserState,
  MoodTag
} from "./checkInTypes";

const moodStateMap: Record<
  MoodTag,
  Pick<DerivedUserState, "mood" | "energyLevel" | "stressLevel" | "needsComfort">
> = {
  okay: {
    mood: "neutral",
    energyLevel: "normal",
    stressLevel: "low",
    needsComfort: false
  },
  low_battery: {
    mood: "tired",
    energyLevel: "critical",
    stressLevel: "medium",
    needsComfort: true
  },
  annoyed: {
    mood: "angry",
    energyLevel: "low",
    stressLevel: "high",
    needsComfort: true
  },
  lonely: {
    mood: "lonely",
    energyLevel: "low",
    stressLevel: "medium",
    needsComfort: true
  },
  no_thoughts: {
    mood: "overloaded",
    energyLevel: "low",
    stressLevel: "medium",
    needsComfort: true
  }
};

export const deriveUserState = (input: CheckInInput): DerivedUserState => {
  const baseState = moodStateMap[input.moodTag];

  let stressLevel = baseState.stressLevel;
  let hasWalletPressure = false;
  let needsRest = false;
  let needsFoodSuggestion = false;

  for (const contextTag of input.contextTags) {
    if (contextTag === "wallet_pressure") {
      hasWalletPressure = true;
    }

    if (contextTag === "work_stress") {
      stressLevel = "high";
    }

    if (contextTag === "social_fatigue" || contextTag === "want_to_rest") {
      needsRest = true;
    }

    if (contextTag === "dinner_problem") {
      needsFoodSuggestion = true;
    }
  }

  return {
    ...baseState,
    stressLevel,
    hasWalletPressure,
    needsRest,
    needsFoodSuggestion
  };
};
