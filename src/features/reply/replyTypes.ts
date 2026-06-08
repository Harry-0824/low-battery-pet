import type { CheckInInput } from "../checkIn/checkInTypes";

export type ReplyTone = "calm" | "soft" | "grounding" | "warm" | "minimal";

export interface CompanionReplyInput extends CheckInInput {
  shortText?: string;
}

export interface CompanionReply {
  reply: string;
  petLine: string;
  tinyAction: string;
  tone: ReplyTone;
  note?: string;
}
