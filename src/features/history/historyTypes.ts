import type { ContextTag, DerivedUserState, MoodTag } from "../checkIn/checkInTypes";
import type { PetState } from "../pet/petTypes";
import type { CompanionReply } from "../reply/replyTypes";

/**
 * 歷史紀錄型別定義
 *
 * CheckInHistoryRecord 是一筆完整的 check-in 紀錄，
 * 包含使用者當時的輸入、系統推導的狀態、寵物表現和陪伴回覆。
 */

export interface CheckInHistoryRecord {
  moodTag: MoodTag;
  contextTags: ContextTag[];
  shortText: string;
  derivedUserState: DerivedUserState;
  petState: PetState;
  companionReply: CompanionReply;
  createdAt: string;
}

/** 後續追問的選項 */
export type FollowUpOption = "還是有點難" | "好一點點" | "還不知道" | "不想說";

/** 使用者對追問的回應記錄 */
export interface FollowUpResponse {
  recordCreatedAt: string;
  option: FollowUpOption;
  answeredAt: string;
}
