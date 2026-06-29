import type { DerivedUserState } from "../checkIn/checkInTypes";
import type { PetState } from "./petTypes";

/**
 * 寵物狀態引擎
 *
 * 這是整個應用「陪伴感」的核心邏輯：
 * 根據使用者的內在狀態（DerivedUserState），
 *  deterministic 地輸出寵物應該呈現的樣子（PetState）。
 *
 * 設計原則：
 * - Priority order：多個條件同時成立時，依順序優先級決定結果，
 *   確保相同輸入永遠得到相同輸出（可預測、易於測試）。
 * - 免運算子：不依賴 Math.random，讓測試和記錄呈現穩定一致。
 */

/** 預設的待機狀態，當沒有任何特殊條件成立時使用 */
const idleState: PetState = {
  mood: "idle",
  animation: "idle",
  effect: "none",
  accessory: "none"
};

/**
 * 計算寵物應該呈現的狀態外顯
 *
 * 優先順序（高到低）：
 * 1. energyLevel === "critical" → 快沒電（小雞球睡覺）
 * 2. stressLevel === "high" → 壓力爆表（頭上冒黑雲、抖動）
 * 3. mood === "lonely" → 孤單（躲起來、下雨）
 * 4. hasWalletPressure → 錢包有壓力（炸毛、硬幣特效）
 * 5. needsFoodSuggestion → 需要晚餐建議（抱著飯糰）
 * 6. 其他 → 普通待機
 */
export const calculatePetState = (derivedState: DerivedUserState): PetState => {
  // Priority order keeps the result deterministic when multiple conditions apply.
  if (derivedState.energyLevel === "critical") {
    return {
      mood: "low_power",
      animation: "sleep",
      effect: "low_battery",
      accessory: "none"
    };
  }

  if (derivedState.stressLevel === "high") {
    return {
      mood: "stressed",
      animation: "shake",
      effect: "black_cloud",
      accessory: "none"
    };
  }

  if (derivedState.mood === "lonely") {
    return {
      mood: "lonely",
      animation: "hide",
      effect: "rain",
      accessory: "none"
    };
  }

  if (derivedState.hasWalletPressure) {
    return {
      mood: "grumpy",
      animation: "idle",
      effect: "coins",
      accessory: "coin"
    };
  }

  if (derivedState.needsFoodSuggestion) {
    return {
      mood: "hungry",
      animation: "idle",
      effect: "none",
      accessory: "rice_ball"
    };
  }

  if (derivedState.energyLevel === "full") {
    return {
      mood: "charged",
      animation: "bounce",
      effect: "spark",
      accessory: "none"
    };
  }

  if (derivedState.mood === "bright") {
    return {
      mood: "joyful",
      animation: "bounce",
      effect: "spark",
      accessory: "none"
    };
  }

  if (derivedState.mood === "content") {
    return {
      mood: "calm",
      animation: "sway",
      effect: "warm_glow",
      accessory: "sun_dot"
    };
  }

  return idleState;
};
