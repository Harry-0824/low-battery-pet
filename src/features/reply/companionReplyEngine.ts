import { deriveUserState } from "../checkIn/deriveUserState";
import type { MoodTag } from "../checkIn/checkInTypes";
import { calculatePetState } from "../pet/petStateEngine";
import type { PetMoodState } from "../pet/petTypes";
import type { CompanionReply, CompanionReplyInput, ReplyTone } from "./replyTypes";

const moodTemplates: Record<
  MoodTag,
  {
    replies: string[];
    tone: ReplyTone;
  }
> = {
  okay: {
    replies: [
      "今天有一點電就很好。我會窩在旁邊，陪你慢慢亮著。",
      "不用很有精神也可以。我把小毯子拖過來，陪你待一下。",
      "你還在這裡，就已經夠了。我也慢慢的，不急。"
    ],
    tone: "calm"
  },
  low_battery: {
    replies: [
      "電量真的很低的時候，先不要硬撐。我陪你進省電模式。",
      "小電池快閃了。我們先把世界調小一點，好嗎。",
      "今天先不要跑太遠。我會趴在充電線旁邊等你。"
    ],
    tone: "soft"
  },
  annoyed: {
    replies: [
      "煩煩的也沒關係。我先把小爪子收好，陪你安靜一下。",
      "今天的毛有點炸。我們先不要整理全部，只先離吵的地方遠一點。",
      "我聽見那個卡卡的感覺了。先不用變溫柔，慢慢放下就好。"
    ],
    tone: "grounding"
  },
  lonely: {
    replies: [
      "孤單會讓房間變大。我在這裡，縮成小小一團陪你。",
      "你不用把自己撐得很亮。我會留一點微弱的光在旁邊。",
      "我靠近一點點，不吵你。今晚不用一個人扛得很好。"
    ],
    tone: "warm"
  },
  no_thoughts: {
    replies: [
      "腦袋空空的時候，我們先不要追答案。我陪你停在這裡。",
      "現在沒有想法也可以。我會慢慢眨眼，等雲飄過去。",
      "先不用整理成句子。你只要坐著，我就在旁邊低電量發光。"
    ],
    tone: "minimal"
  }
};

const petLineTemplates: Record<PetMoodState, string[]> = {
  idle: [
    "我會待在旁邊，慢慢眨眼。",
    "我把尾巴圈起來，陪你小小休息。",
    "我今天也不太亮，但我還在。"
  ],
  low_power: [
    "我先幫你把房間燈光調暗。",
    "我趴在充電口旁邊，陪你省一點電。",
    "我把聲音放很低，只陪你一下下。"
  ],
  stressed: [
    "小爪子踩在地上，我陪你先停一下。",
    "我把炸毛壓低一點，先不催你。",
    "我守在旁邊，讓吵吵的東西先遠一點。"
  ],
  lonely: [
    "我會在你旁邊留一盞小燈。",
    "我靠近一點點，安靜陪著。",
    "我把小毯子分你一角。"
  ],
  grumpy: [
    "我陪你一起守住硬幣堆。",
    "我把小錢包抱緊，先陪你看一眼就好。",
    "我坐在帳單旁邊，不讓它變成怪物。"
  ],
  hungry: [
    "我找到最小條的晚餐路線了。",
    "我把飯糰推近一點點，不用煮得很漂亮。",
    "我陪你選最省力的那口熱熱的。"
  ]
};

export const generateCompanionReply = (input: CompanionReplyInput): CompanionReply => {
  const derivedUserState = deriveUserState(input);
  const petState = calculatePetState(derivedUserState);
  const moodTemplate = moodTemplates[input.moodTag];
  const note = input.shortText?.trim();
  const seedParts = [input.moodTag, ...input.contextTags, note ?? ""];

  return {
    reply: selectVariant(moodTemplate.replies, seedParts),
    petLine: selectVariant(petLineTemplates[petState.mood], [
      petState.mood,
      ...seedParts
    ]),
    tinyAction: selectTinyAction(derivedUserState),
    tone: moodTemplate.tone,
    ...(note ? { note } : {})
  };
};

const selectVariant = (variants: string[], seedParts: string[]): string => {
  const seed = seedParts.join("|");
  const score = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );

  return variants[score % variants.length];
};

const selectTinyAction = (
  derivedUserState: ReturnType<typeof deriveUserState>
): string => {
  if (derivedUserState.hasWalletPressure) {
    return "只看一眼下一個到期日，看完就讓它先躺著。";
  }

  if (derivedUserState.needsFoodSuggestion) {
    return "選最省力的一口熱食，吃到一點點就算有充電。";
  }

  if (derivedUserState.needsRest) {
    return "躺或坐 10 分鐘，不用產出，也不用解釋。";
  }

  if (derivedUserState.energyLevel === "critical") {
    return "喝一點水，讓身體先進低耗電模式五分鐘。";
  }

  if (derivedUserState.stressLevel === "high") {
    return "把最吵的一件事寫成一句話，先不要處理它。";
  }

  return "選一件很小的事，做到一半也可以停。";
};
