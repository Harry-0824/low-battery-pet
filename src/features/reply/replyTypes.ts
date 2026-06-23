import type { CheckInInput } from "../checkIn/checkInTypes";

/**
 * 陪伴回覆功能型別定義
 *
 * CompanionReply 是小電量獸給使用者的回覆內容，
 * 包含情緒回覆、寵物自言自語、以及一個很具體的「一件小事」行動建議。
 */

/** 回覆的語氣類型，不同語氣會影響整體 wording */
export type ReplyTone = "calm" | "soft" | "grounding" | "warm" | "minimal";

/**
 * 生成陪伴回覆時需要的輸入資料
 * 在 CheckInInput 的基礎上，還可包含 optional 的 shortText
 */
export interface CompanionReplyInput extends CheckInInput {
  shortText?: string;
}

/**
 * 小電量獸對使用者的完整回覆
 *
 * - reply: 主要的情緒共鳴回覆
 * - petLine: 寵物自己的小聲音（寵物視角）
 * - tinyAction: 一個很小的、具体的行動建議
 * - tone: 語氣標籤（可用於測試或未來 UI 調整）
 * - note: 可選的使用者短文字備註（不會在 UI 顯示，只留存在紀錄中）
 */
export interface CompanionReply {
  reply: string;
  petLine: string;
  tinyAction: string;
  tone: ReplyTone;
  note?: string;
}
