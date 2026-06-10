import type { CheckInHistoryRecord } from "./historyTypes";

export const CHECK_IN_HISTORY_STORAGE_KEY = "low-battery-pet:check-ins";

const MAX_HISTORY_RECORDS = 30;

export const loadCheckInHistory = (): CheckInHistoryRecord[] => {
  const storedValue = localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  const records = JSON.parse(storedValue) as CheckInHistoryRecord[];

  return sortNewestFirst(records).slice(0, MAX_HISTORY_RECORDS);
};

export const saveCheckInRecord = (record: CheckInHistoryRecord): CheckInHistoryRecord[] => {
  const records = [record, ...loadCheckInHistory()]
    .sort(compareNewestFirst)
    .slice(0, MAX_HISTORY_RECORDS);

  localStorage.setItem(CHECK_IN_HISTORY_STORAGE_KEY, JSON.stringify(records));

  return records;
};

export const clearCheckInHistory = () => {
  localStorage.removeItem(CHECK_IN_HISTORY_STORAGE_KEY);
};

export const getCompanionDayCount = (records: CheckInHistoryRecord[]) =>
  new Set(records.map((record) => getLocalDateKey(record.createdAt))).size;

const sortNewestFirst = (records: CheckInHistoryRecord[]) => [...records].sort(compareNewestFirst);

const compareNewestFirst = (first: CheckInHistoryRecord, second: CheckInHistoryRecord) =>
  second.createdAt.localeCompare(first.createdAt);

const getLocalDateKey = (createdAt: string) => {
  const date = new Date(createdAt);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
};
