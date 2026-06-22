import type { ContextTag, DerivedUserState, MoodTag } from "../checkIn/checkInTypes";
import type { PetState } from "../pet/petTypes";
import type { CompanionReply } from "../reply/replyTypes";

export interface CheckInHistoryRecord {
  moodTag: MoodTag;
  contextTags: ContextTag[];
  shortText: string;
  derivedUserState: DerivedUserState;
  petState: PetState;
  companionReply: CompanionReply;
  createdAt: string;
}

export type FollowUpOption = "還是有點難" | "好一點點" | "還不知道" | "不想說";

export interface FollowUpResponse {
  recordCreatedAt: string;
  option: FollowUpOption;
  answeredAt: string;
}
