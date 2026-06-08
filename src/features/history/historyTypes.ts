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
