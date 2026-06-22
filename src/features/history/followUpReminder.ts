import type { CheckInHistoryRecord, FollowUpOption, FollowUpResponse } from "./historyTypes";

export const FOLLOW_UP_OPTIONS: FollowUpOption[] = [
  "還是有點難",
  "好一點點",
  "還不知道",
  "不想說"
];

export const FOLLOW_UP_RESPONSES_STORAGE_KEY = "low-battery-pet:follow-up-responses";

const FOLLOW_UP_WINDOW_START_MS = 6 * 60 * 60 * 1000;
const FOLLOW_UP_WINDOW_END_MS = 12 * 60 * 60 * 1000;

export const loadFollowUpResponses = (): FollowUpResponse[] => {
  const storedValue = localStorage.getItem(FOLLOW_UP_RESPONSES_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  return JSON.parse(storedValue) as FollowUpResponse[];
};

export const getPendingFollowUpRecord = (
  records: CheckInHistoryRecord[],
  answeredRecordCreatedAts: string[],
  referenceDate = new Date()
) => {
  const latestRecord = [...records].sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt)
  )[0];

  if (!latestRecord || answeredRecordCreatedAts.includes(latestRecord.createdAt)) {
    return null;
  }

  const elapsedMs = referenceDate.getTime() - new Date(latestRecord.createdAt).getTime();

  if (elapsedMs < FOLLOW_UP_WINDOW_START_MS || elapsedMs > FOLLOW_UP_WINDOW_END_MS) {
    return null;
  }

  return latestRecord;
};

export const saveFollowUpResponse = (
  recordCreatedAt: string,
  option: FollowUpOption,
  answeredAt = new Date().toISOString()
) => {
  const nextResponses = [
    ...loadFollowUpResponses().filter(
      (response) => response.recordCreatedAt !== recordCreatedAt
    ),
    {
      recordCreatedAt,
      option,
      answeredAt
    }
  ];

  localStorage.setItem(FOLLOW_UP_RESPONSES_STORAGE_KEY, JSON.stringify(nextResponses));

  return nextResponses;
};
