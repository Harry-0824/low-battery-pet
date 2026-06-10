import type { CheckInHistoryRecord } from "./historyTypes";

const moodSummary = {
  okay: "還行",
  low_battery: "快沒電",
  annoyed: "很煩",
  lonely: "有點孤單",
  no_thoughts: "腦袋空白"
} satisfies Record<CheckInHistoryRecord["moodTag"], string>;

const contextSummary = {
  wallet_pressure: "錢包有壓力",
  work_stress: "工作太滿",
  social_fatigue: "社交疲勞",
  dinner_problem: "晚餐不知道",
  want_to_rest: "想躺著"
} satisfies Record<CheckInHistoryRecord["contextTags"][number], string>;

const petSummary = {
  idle: "小電量獸待機中",
  low_power: "小電量獸快沒電了",
  stressed: "小電量獸頭上冒黑雲",
  lonely: "小電量獸躲到角落",
  grumpy: "小電量獸炸毛中",
  hungry: "小電量獸抱著飯糰"
} satisfies Record<CheckInHistoryRecord["petState"]["mood"], string>;

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

export const formatHistoryContextTags = (record: CheckInHistoryRecord) => {
  const summaries = [
    moodSummary[record.moodTag],
    ...record.contextTags.map((contextTag) => contextSummary[contextTag])
  ];

  return summaries.join("・");
};

export const formatHistoryPetSummary = (record: CheckInHistoryRecord) =>
  petSummary[record.petState.mood];

export const formatHistoryReplySummary = (record: CheckInHistoryRecord) => {
  const [firstSentence] = record.companionReply.reply.split(".");

  return firstSentence ? `${firstSentence}.` : record.companionReply.reply;
};

const padTime = (value: number) => String(value).padStart(2, "0");
