import type { CheckInHistoryRecord } from "./historyTypes";

export const CHECK_IN_HISTORY_STORAGE_KEY = "low-battery-pet:check-ins";

const MAX_HISTORY_RECORDS = 30;
const RECENT_BATTERY_TRAIL_DAYS = 7;
const PET_MEMORY_RECORD_LIMIT = 4;

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

export const getPetStateMemoryMessage = (records: CheckInHistoryRecord[]) => {
  const recentRecords = sortNewestFirst(records).slice(0, PET_MEMORY_RECORD_LIMIT);

  if (recentRecords.length < 2) {
    return null;
  }

  const [latestRecord, ...olderRecords] = recentRecords;
  const tiredRecords = recentRecords.filter((record) => isLowPowerRecord(record));
  const olderTiredRecords = olderRecords.filter((record) => isLowPowerRecord(record));

  if (latestRecord.derivedUserState.energyLevel === "normal" && olderTiredRecords.length > 0) {
    return "這幾天有稍微回充一點點。那一點點也會被小電量獸記得。";
  }

  if (tiredRecords.length >= 2) {
    return "最近好像常常在省電模式。小電量獸會把燈開小一點，陪你慢慢待著。";
  }

  if (olderTiredRecords.length > 0) {
    return "前幾天看起來比較累。今天先不用急著變好。";
  }

  return "小電量獸記得這幾天你有來過。慢慢來就好。";
};

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

const isLowPowerRecord = (record: CheckInHistoryRecord) =>
  record.derivedUserState.energyLevel === "low" ||
  record.derivedUserState.energyLevel === "critical";

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
