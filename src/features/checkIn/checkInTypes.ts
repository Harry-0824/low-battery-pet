export type MoodTag =
  | "okay"
  | "low_battery"
  | "annoyed"
  | "lonely"
  | "no_thoughts";

export type ContextTag =
  | "wallet_pressure"
  | "work_stress"
  | "social_fatigue"
  | "dinner_problem"
  | "want_to_rest";

export type UserMood = "neutral" | "tired" | "angry" | "lonely" | "overloaded";

export type EnergyLevel = "normal" | "low" | "critical";

export type StressLevel = "low" | "medium" | "high";

export interface CheckInInput {
  moodTag: MoodTag;
  contextTags: ContextTag[];
}

export interface DerivedUserState {
  mood: UserMood;
  energyLevel: EnergyLevel;
  stressLevel: StressLevel;
  needsComfort: boolean;
  hasWalletPressure: boolean;
  needsRest: boolean;
  needsFoodSuggestion: boolean;
}
