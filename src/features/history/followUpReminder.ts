import type { CheckInHistoryRecord, FollowUpOption, FollowUpResponse } from "./historyTypes";

/**
 * 後續追問功能模組
 *
 * 當使用者在 6~12 小時前完成一次 check-in 後，
 * 系統會在下次開啟 app 時追問「剛剛那段時間，現在怎麼樣？」
 * 讓使用者可以簡短回覆，幫助小電量獸持續陪使用者。
 */

/** 追問的選項 */
export const FOLLOW_UP_OPTIONS: FollowUpOption[] = [
  "還是有點難",
  "好一點點",
  "還不知道",
  "不想說"
];

/** localStorage key：儲存使用者對追問的回應 */
export const FOLLOW_UP_RESPONSES_STORAGE_KEY = "low-battery-pet:follow-up-responses";

/** 追問時間窗的開始時間：6 小時後才開始追問 */
const FOLLOW_UP_WINDOW_START_MS = 6 * 60 * 60 * 1000;
/** 追問時間窗的結束時間：12 小時後就視為過期，不再追問 */
const FOLLOW_UP_WINDOW_END_MS = 12 * 60 * 60 * 1000;

/**
 * 從 localStorage 載入所有追問回應
 */
export const loadFollowUpResponses = (): FollowUpResponse[] => {
  const storedValue = localStorage.getItem(FOLLOW_UP_RESPONSES_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  return JSON.parse(storedValue) as FollowUpResponse[];
};

/**
 * 找出一張「待追問」的歷史紀錄
 *
 * 條件：
 * 1. 必須是最近的一筆紀錄
 * 2. 使用者尚未對此筆紀錄回答過追問
 * 3. 該紀錄的 createdAt 落在 6~12 小時的時間窗內（以 referenceDate 為準）
 *
 * @param records - 所有歷史紀錄
 * @param answeredRecordCreatedAts - 已被回答過的紀錄 createdAt 清單
 * @param referenceDate - 參考時間，預設為現在
 */
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

/**
 * 儲存使用者對追問的回應
 *
 * 會將同一筆紀錄的新回應覆蓋舊回應，
 * 並回傳更新後的所有回應清單。
 */
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
