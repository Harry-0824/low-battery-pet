import type { CheckInHistoryRecord } from "./historyTypes";

/**
 * 歷史儲存模組
 *
 * 負責所有 check-in 紀錄的讀寫、刪除、查詢。
 * 所有資料都貯存在瀏覽器的 localStorage 中，local-first 設計。
 */

/** localStorage 中儲存 check-in 紀錄的 key */
export const CHECK_IN_HISTORY_STORAGE_KEY = "low-battery-pet:check-ins";
/** 最多保留的歷史紀錄筆數，超過時會自動淘汰最舊的 */
export const CHECK_IN_HISTORY_RECORD_LIMIT = 30;
/** 當剩餘名額少於此值時，會顯示清理提示 */
export const CHECK_IN_HISTORY_LIMIT_HINT_THRESHOLD = CHECK_IN_HISTORY_RECORD_LIMIT - 3;

/** 電池足跡圖要顯示最近幾天 */
const RECENT_BATTERY_TRAIL_DAYS = 7;
/** 寵物記憶功能只看最近幾筆紀錄來判斷使用者近況 */
const PET_MEMORY_RECORD_LIMIT = 4;

export type BatteryTrailEnergyLevel =
  | CheckInHistoryRecord["derivedUserState"]["energyLevel"]
  | "empty";

export interface BatteryTrailDay {
  dateKey: string;
  label: string;
  energyLevel: BatteryTrailEnergyLevel;
}

/**
 * 從 localStorage 載入所有歷史紀錄
 *
 * 會自動依 createdAt 由新到舊排序，
 * 並限制最多回傳 CHECK_IN_HISTORY_RECORD_LIMIT 筆。
 */
export const loadCheckInHistory = (): CheckInHistoryRecord[] => {
  const storedValue = localStorage.getItem(CHECK_IN_HISTORY_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  const records = JSON.parse(storedValue) as CheckInHistoryRecord[];

  return sortNewestFirst(records).slice(0, CHECK_IN_HISTORY_RECORD_LIMIT);
};

/**
 * 儲存一筆新的 check-in 紀錄
 *
 * 新紀錄會插入陣列最前面，重新排序後只保留最新的 N 筆，
 * 避免 localStorage 無限膨脹。
 */
export const saveCheckInRecord = (record: CheckInHistoryRecord): CheckInHistoryRecord[] => {
  const records = [record, ...loadCheckInHistory()]
    .sort(compareNewestFirst)
    .slice(0, CHECK_IN_HISTORY_RECORD_LIMIT);

  localStorage.setItem(CHECK_IN_HISTORY_STORAGE_KEY, JSON.stringify(records));

  return records;
};

/** 清除所有歷史紀錄（localStorage + React state） */
export const clearCheckInHistory = () => {
  localStorage.removeItem(CHECK_IN_HISTORY_STORAGE_KEY);
};

/**
 * 刪除指定日期的所有歷史紀錄
 *
 * 按「本地日期」比對，刪除該日所有紀錄。
 * 若刪除後沒有剩餘紀錄，會連同 localStorage key 一起刪除。
 */
export const deleteCheckInHistoryDay = (createdAt: string): CheckInHistoryRecord[] => {
  const targetDateKey = getLocalDateKey(createdAt);
  const records = loadCheckInHistory().filter(
    (record) => getLocalDateKey(record.createdAt) !== targetDateKey
  );

  if (records.length === 0) {
    localStorage.removeItem(CHECK_IN_HISTORY_STORAGE_KEY);
  } else {
    localStorage.setItem(CHECK_IN_HISTORY_STORAGE_KEY, JSON.stringify(records));
  }

  return records;
};

/**
 * 計算使用者來過的天數
 * 依據創建日期的本地日期去重後計算
 */
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
