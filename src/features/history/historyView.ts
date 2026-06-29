import type { CheckInHistoryRecord } from "./historyTypes";

/**
 * 歷史檢視格式化模組
 *
 * 負責將內部歷史紀錄格式化成使用者能閱讀的介面文字，
 * 包括時間、情境標籤、寵物狀態摘要和回覆摘要。
 */

const moodSummary = {
  energized: "有電",
  joyful: "雀躍",
  content: "平靜",
  okay: "還行",
  low_battery: "快沒電",
  annoyed: "很煩",
  lonely: "有點孤單",
  no_thoughts: "腦袋空白"
} satisfies Record<CheckInHistoryRecord["moodTag"], string>;

const contextSummary = {
  small_win: "小小完成",
  rested_well: "有休息到",
  connected: "有被連著",
  wallet_pressure: "錢包有壓力",
  work_stress: "工作太滿",
  social_fatigue: "社交疲勞",
  dinner_problem: "晚餐不知道",
  want_to_rest: "想躺著"
} satisfies Record<CheckInHistoryRecord["contextTags"][number], string>;

const petSummary = {
  charged: "小電量獸充了一點電",
  joyful: "小電量獸輕輕雀躍",
  calm: "小電量獸安靜曬太陽",
  idle: "小電量獸待機中",
  low_power: "小電量獸快沒電了",
  stressed: "小電量獸頭上冒黑雲",
  lonely: "小電量獸躲到角落",
  grumpy: "小電量獸炸毛中",
  hungry: "小電量獸抱著飯糰"
} satisfies Record<CheckInHistoryRecord["petState"]["mood"], string>;

/**
 * 格式化歷史紀錄的建立時間
 * - 如果是今天：顯示「今天 HH:MM」
 * - 否則顯示「M/D HH:MM」
 * - 若日期無效：顯示「時間不明」
 */
export const formatHistoryCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "時間不明";
  }

  const time = `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
  const now = new Date();

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return `今天 ${time}`;
  }

  return `${date.getMonth() + 1}/${date.getDate()} ${time}`;
};

/**
 * 格式化歷史卡片的情境標籤列
 * 將心情標籤與所有情境標籤用・連接成一行
 */
export const formatHistoryContextTags = (record: CheckInHistoryRecord) => {
  const summaries = [
    moodSummary[record.moodTag],
    ...record.contextTags.map((contextTag) => contextSummary[contextTag])
  ];

  return summaries.join("・");
};

/** 格式化寵物在歷史紀錄中的狀態標語 */
export const formatHistoryPetSummary = (record: CheckInHistoryRecord) =>
  petSummary[record.petState.mood];

/**
 * 格式化陪伴回覆的摘要
 * 只取回覆的第一句話（以句點分隔），
 * 避免完整回覆太長影響歷史卡片版面
 */
export const formatHistoryReplySummary = (record: CheckInHistoryRecord) => {
  const [firstSentence] = record.companionReply.reply.split(".");

  return firstSentence ? `${firstSentence}.` : record.companionReply.reply;
};

const padTime = (value: number) => String(value).padStart(2, "0");
