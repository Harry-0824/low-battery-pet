import { deriveUserState } from "../checkIn/deriveUserState";
import type { MoodTag } from "../checkIn/checkInTypes";
import { calculatePetState } from "../pet/petStateEngine";
import type { PetMoodState } from "../pet/petTypes";
import type { CompanionReply, CompanionReplyInput, ReplyTone } from "./replyTypes";

const moodTemplates: Record<
  MoodTag,
  {
    reply: string;
    tone: ReplyTone;
  }
> = {
  okay: {
    reply: "能穩穩撐住也算數。我會坐在旁邊，陪你把步調放小。",
    tone: "calm"
  },
  low_battery: {
    reply: "你的電量聽起來很低。先不用做大事，從一個很小的重開機開始。",
    tone: "soft"
  },
  annoyed: {
    reply: "煩躁可以先存在。我們先把火降下來，再決定下一步。",
    tone: "grounding"
  },
  lonely: {
    reply: "孤單的夜晚會比較重。我在這裡，你不用努力表現得很好。",
    tone: "warm"
  },
  no_thoughts: {
    reply: "腦袋空白也是一種訊號。我們把下一步縮到很小就好。",
    tone: "minimal"
  }
};

const petLineTemplates: Record<PetMoodState, string> = {
  idle: "我會待在旁邊，慢慢眨眼。",
  low_power: "我先幫你把房間燈光調暗。",
  stressed: "小爪子踩在地上。我們先呼吸。",
  lonely: "我會在你旁邊留一盞小燈。",
  grumpy: "我陪你一起守住硬幣堆。",
  hungry: "我找到最小條的晚餐路線了。"
};

export const generateCompanionReply = (input: CompanionReplyInput): CompanionReply => {
  const derivedUserState = deriveUserState(input);
  const petState = calculatePetState(derivedUserState);
  const moodTemplate = moodTemplates[input.moodTag];
  const note = input.shortText?.trim();

  return {
    reply: moodTemplate.reply,
    petLine: petLineTemplates[petState.mood],
    tinyAction: selectTinyAction(derivedUserState),
    tone: moodTemplate.tone,
    ...(note ? { note } : {})
  };
};

const selectTinyAction = (
  derivedUserState: ReturnType<typeof deriveUserState>
): string => {
  if (derivedUserState.hasWalletPressure) {
    return "打開一張帳單或餘額，看見下一個到期日就先停。";
  }

  if (derivedUserState.needsFoodSuggestion) {
    return "選現在最容易取得的熱食，不用完美。";
  }

  if (derivedUserState.needsRest) {
    return "設一個 10 分鐘不用產出的休息，把手機螢幕朝下。";
  }

  if (derivedUserState.energyLevel === "critical") {
    return "喝點水，安靜躺五分鐘。";
  }

  if (derivedUserState.stressLevel === "high") {
    return "把煩人的事說出來一次，然後鬆開手。";
  }

  return "選一件小任務，開始前再把它縮小一點。";
};
