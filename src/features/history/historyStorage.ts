import type { CheckInHistoryRecord } from "./historyTypes";

export const CHECK_IN_HISTORY_STORAGE_KEY = "low-battery-pet:check-ins";

const MAX_HISTORY_RECORDS = 30;
const RECENT_BATTERY_TRAIL_DAYS = 7;

export type BatteryTrailEnergyLevel =
  | CheckInHistoryRecord["derivedUserState"]["energyLevel"]
  | "empty";

export interface BatteryTrailDay {
  dateKey: string;
  label: string;
  energyLevel: BatteryTrailEnergyLevel;
}

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

export const getRecentBatteryTrail = (
  records: CheckInHistoryRecord[],
  referenceDate = new Date()
): BatteryTrailDay[] => {
  const latestRecordByDate = new Map<string, CheckInHistoryRecord>();

  for (const record of sortNewestFirst(records)) {
    const dateKey = getLocalDateKey(record.createdAt);

    if (!latestRecordByDate.has(dateKey)) {
      latestRecordByDate.set(dateKey, record);
    }
  }

  return Array.from({ length: RECENT_BATTERY_TRAIL_DAYS }, (_, index) => {
    const daysAgo = RECENT_BATTERY_TRAIL_DAYS - index - 1;
    const date = getShiftedLocalDate(referenceDate, -daysAgo);
    const dateKey = getLocalDateKey(date);
    const record = latestRecordByDate.get(dateKey);

    return {
      dateKey,
      label: formatTrailDateLabel(date, daysAgo),
      energyLevel: record?.derivedUserState.energyLevel ?? "empty"
    };
  });
};

const sortNewestFirst = (records: CheckInHistoryRecord[]) => [...records].sort(compareNewestFirst);

const compareNewestFirst = (first: CheckInHistoryRecord, second: CheckInHistoryRecord) =>
  second.createdAt.localeCompare(first.createdAt);

const getLocalDateKey = (createdAt: string | Date) => {
  const date = new Date(createdAt);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
};

const getShiftedLocalDate = (date: Date, dayOffset: number) => {
  const shiftedDate = new Date(date);
  shiftedDate.setHours(12, 0, 0, 0);
  shiftedDate.setDate(shiftedDate.getDate() + dayOffset);

  return shiftedDate;
};

const formatTrailDateLabel = (date: Date, daysAgo: number) => {
  if (daysAgo === 0) {
    return "今天";
  }

  if (daysAgo === 1) {
    return "昨天";
  }

  return `${date.getMonth() + 1}/${date.getDate()}`;
};
