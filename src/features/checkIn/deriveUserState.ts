import type {
  CheckInInput,
  DerivedUserState,
  MoodTag
} from "./checkInTypes";

/**
 * 心情標籤基礎狀態對照表
 *
 * 每種心情對應一個預設的內在狀態（情緒、能量、壓力、是否需要安慰）。
 * Context tags 的疊加效果會在 deriveUserState 中處理。
 */
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

/**
 * 根據使用者的心情和情境標籤，推導出完整的內在狀態
 *
 * 這是 check-in 流程中的核心推理步驟：
 * 1. 先根據心情標籤取出基礎狀態
 * 2. 再根據情境標籤疊加額外的壓力、需求和壓力升級
 *
 * 例如：心情「快沒電」本身就會讓 energyLevel 變 critical，
 * 但如果再加上「工作太滿」，stressLevel 會從 medium 升到 high。
 */
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
