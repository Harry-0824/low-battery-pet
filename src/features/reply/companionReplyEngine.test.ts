import { describe, expect, it } from "vitest";

import type { CheckInInput, ContextTag, MoodTag } from "../checkIn/checkInTypes";
import { generateCompanionReply } from "./companionReplyEngine";

const createInput = (
  moodTag: MoodTag,
  contextTags: ContextTag[] = []
): CheckInInput => ({
  moodTag,
  contextTags
});

describe("generateCompanionReply", () => {
  const moodCases: Array<{
    moodTag: MoodTag;
    expectedTone: string;
    expectedReplies: string[];
  }> = [
    {
      moodTag: "okay",
      expectedTone: "calm",
      expectedReplies: [
        "今天有一點電就很好。我會窩在旁邊，陪你慢慢亮著。",
        "不用很有精神也可以。我把小毯子拖過來，陪你待一下。",
        "你還在這裡，就已經夠了。我也慢慢的，不急。"
      ]
    },
    {
      moodTag: "low_battery",
      expectedTone: "soft",
      expectedReplies: [
        "電量真的很低的時候，先不要硬撐。我陪你進省電模式。",
        "小電池快閃了。我們先把世界調小一點，好嗎。",
        "今天先不要跑太遠。我會趴在充電線旁邊等你。"
      ]
    },
    {
      moodTag: "annoyed",
      expectedTone: "grounding",
      expectedReplies: [
        "煩煩的也沒關係。我先把小爪子收好，陪你安靜一下。",
        "今天的毛有點炸。我們先不要整理全部，只先離吵的地方遠一點。",
        "我聽見那個卡卡的感覺了。先不用變溫柔，慢慢放下就好。"
      ]
    },
    {
      moodTag: "lonely",
      expectedTone: "warm",
      expectedReplies: [
        "孤單會讓房間變大。我在這裡，縮成小小一團陪你。",
        "你不用把自己撐得很亮。我會留一點微弱的光在旁邊。",
        "我靠近一點點，不吵你。今晚不用一個人扛得很好。"
      ]
    },
    {
      moodTag: "no_thoughts",
      expectedTone: "minimal",
      expectedReplies: [
        "腦袋空空的時候，我們先不要追答案。我陪你停在這裡。",
        "現在沒有想法也可以。我會慢慢眨眼，等雲飄過去。",
        "先不用整理成句子。你只要坐著，我就在旁邊低電量發光。"
      ]
    }
  ];

  it.each(moodCases)("maps $moodTag to a gentle deterministic companion reply", ({
    moodTag,
    expectedTone,
    expectedReplies
  }) => {
    const result = generateCompanionReply(createInput(moodTag));

    expect(result.tone).toBe(expectedTone);
    expect(expectedReplies).toContain(result.reply);
  });

  it("keeps variant selection deterministic for the same input", () => {
    const input = {
      ...createInput("lonely", ["social_fatigue"]),
      shortText: "今天有點安靜"
    };

    expect(generateCompanionReply(input)).toEqual(generateCompanionReply(input));
  });

  it.each([
    {
      moodTag: "no_thoughts" as const,
      contextTags: ["work_stress"] as const,
      expectedReply:
        "今天腦袋被工作塞滿了也沒關係，小電量獸先陪你把下一步縮小到一口氣。"
    },
    {
      moodTag: "low_battery" as const,
      contextTags: ["wallet_pressure"] as const,
      expectedReply:
        "錢包壓力和低電量一起來時，先不用解決全部；我們先守住今天最小的一步。"
    },
    {
      moodTag: "low_battery" as const,
      contextTags: ["dinner_problem"] as const,
      expectedReply:
        "低電量還要想晚餐真的很累，先選一個最不用思考的東西讓身體有電。"
    },
    {
      moodTag: "lonely" as const,
      contextTags: ["social_fatigue"] as const,
      expectedReply:
        "想休息又覺得孤單的時候，可以先安靜待著；小電量獸會在旁邊陪你，不催你聊天。"
    },
    {
      moodTag: "lonely" as const,
      contextTags: ["want_to_rest"] as const,
      expectedReply:
        "想休息又覺得孤單的時候，可以先安靜待著；小電量獸會在旁邊陪你，不催你聊天。"
    }
  ])("uses an integrated reply for $moodTag with $contextTags", ({
    moodTag,
    contextTags,
    expectedReply
  }) => {
    expect(generateCompanionReply(createInput(moodTag, [...contextTags])).reply).toBe(
      expectedReply
    );
  });

  it("uses the wallet pressure tiny action when wallet pressure is present", () => {
    expect(generateCompanionReply(createInput("okay", ["wallet_pressure"]))).toMatchObject({
      tinyAction: "只看一眼下一個到期日，看完就讓它先躺著。"
    });
  });

  it("uses the dinner problem tiny action when dinner help is needed", () => {
    expect(generateCompanionReply(createInput("okay", ["dinner_problem"]))).toMatchObject({
      tinyAction: "選最省力的一口熱食，吃到一點點就算有充電。"
    });
  });

  it("uses the rest tiny action when rest is requested", () => {
    expect(generateCompanionReply(createInput("okay", ["want_to_rest"]))).toMatchObject({
      tinyAction: "躺或坐 10 分鐘，不用產出，也不用解釋。"
    });
  });

  it("uses localized pet lines from the existing pet state", () => {
    expect([
      "我會待在旁邊，慢慢眨眼。",
      "我把尾巴圈起來，陪你小小休息。",
      "我今天也不太亮，但我還在。"
    ]).toContain(generateCompanionReply(createInput("okay")).petLine);
    expect([
      "我先幫你把房間燈光調暗。",
      "我趴在充電口旁邊，陪你省一點電。",
      "我把聲音放很低，只陪你一下下。"
    ]).toContain(generateCompanionReply(createInput("low_battery")).petLine);
    expect([
      "小爪子踩在地上，我陪你先停一下。",
      "我把炸毛壓低一點，先不催你。",
      "我守在旁邊，讓吵吵的東西先遠一點。"
    ]).toContain(generateCompanionReply(createInput("annoyed")).petLine);
    expect([
      "我會在你旁邊留一盞小燈。",
      "我靠近一點點，安靜陪著。",
      "我把小毯子分你一角。"
    ]).toContain(generateCompanionReply(createInput("lonely")).petLine);
    expect([
      "我陪你一起守住硬幣堆。",
      "我把小錢包抱緊，先陪你看一眼就好。",
      "我坐在帳單旁邊，不讓它變成怪物。"
    ]).toContain(generateCompanionReply(createInput("okay", ["wallet_pressure"])).petLine);
    expect([
      "我找到最小條的晚餐路線了。",
      "我把飯糰推近一點點，不用煮得很漂亮。",
      "我陪你選最省力的那口熱熱的。"
    ]).toContain(generateCompanionReply(createInput("okay", ["dinner_problem"])).petLine);
  });
});
