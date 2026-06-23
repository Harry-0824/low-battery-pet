/**
 * checkIn 功能模組的型別定義
 *
 * 這個檔案定義了使用者在每日 check-in 時輸入的標籤類型，
 * 以及系統根據輸入推導出來的使用者內在狀態。
 */

/**
 * 情緒標籤：使用者在表單中選擇的核心心情
 *
 * - okay: 今天還行，电量一般
 * - low_battery: 快沒電了，需要陪伴
 * - annoyed: 很煩，可能有壓力或憤怒
 * - lonely: 有點孤單，需要被接住
 * - no_thoughts: 腦袋空白，不知道該怎麼辦
 */
export type MoodTag =
  | "okay"
  | "low_battery"
  | "annoyed"
  | "lonely"
  | "no_thoughts";

/**
 * 情境標籤：描述今天卡住的地方
 *
 * 可複選，用來進一步推導使用者的壓力來源和需求
 */
export type ContextTag =
  | "wallet_pressure"
  | "work_stress"
  | "social_fatigue"
  | "dinner_problem"
  | "want_to_rest";

/** 根據心情標籤推導出的使用者內在情緒 */
export type UserMood = "neutral" | "tired" | "angry" | "lonely" | "overloaded";

/** 使用者的能量等級 */
export type EnergyLevel = "normal" | "low" | "critical";

/** 使用者的壓力等級 */
export type StressLevel = "low" | "medium" | "high";

/**
 * 使用者送出的 check-in 輸入資料
 * 包含選擇的心情標籤和情境標籤
 */
export interface CheckInInput {
  moodTag: MoodTag;
  contextTags: ContextTag[];
}

/**
 * 根據 CheckInInput 推導出的完整使用者狀態
 *
 * 這是系統用來計算寵物狀態和生成陪伴回覆的中間產物
 */
export interface DerivedUserState {
  mood: UserMood;
  energyLevel: EnergyLevel;
  stressLevel: StressLevel;
  needsComfort: boolean;
  hasWalletPressure: boolean;
  needsRest: boolean;
  needsFoodSuggestion: boolean;
}
