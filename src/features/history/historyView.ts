import type { CheckInHistoryRecord } from "./historyTypes";

export const formatHistoryContextTags = (record: CheckInHistoryRecord) =>
  record.contextTags.length > 0 ? record.contextTags.join(", ") : "none";

export const formatHistoryPetSummary = (record: CheckInHistoryRecord) =>
  `${record.petState.mood} / ${record.petState.effect}`;

export const formatHistoryReplySummary = (record: CheckInHistoryRecord) => {
  const [firstSentence] = record.companionReply.reply.split(".");

  return firstSentence ? `${firstSentence}.` : record.companionReply.reply;
};
