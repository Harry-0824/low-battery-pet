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
      moodTag: "energized",
      expectedTone: "calm",
      expectedReplies: [
        "今天多出來的那一點亮亮，可以先不用花完。我陪你把它留一小格給之後的自己。",
        "有電的感覺很好，也不用急著全部用掉。小電量獸幫你把這份亮度收好一點。",
        "今天身上有一點光。我陪你慢慢走，不用把它變成很多任務。"
      ]
    },
    {
      moodTag: "joyful",
      expectedTone: "warm",
      expectedReplies: [
        "這一點雀躍很珍貴。我幫你輕輕記下來，低電量的時候也可以回來看。",
        "開心來了就先讓它坐一下，不用馬上變成什麼成果。我在旁邊陪它亮著。",
        "今天有一小塊亮亮的時刻。我陪你把它放進口袋，之後需要時再拿出來。"
      ]
    },
    {
      moodTag: "content",
      expectedTone: "calm",
      expectedReplies: [
        "平平穩穩也很好，不一定要很興奮才算有電。我陪你待在這份剛剛好裡。",
        "現在這種安穩的電量很適合慢慢呼吸。我會在旁邊曬一點小太陽。",
        "今天如果只是覺得還不錯，那也很夠了。小電量獸會把這份平靜抱好。"
      ]
    },
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

  it("keeps a positive high-pressure reply gentle instead of forced celebration", () => {
    expect(generateCompanionReply(createInput("joyful", ["work_stress"]))).toMatchObject({
      reply: "有開心，也有工作壓力，兩個都可以同時在。小電量獸不催你慶祝，只陪你把這一點亮收好。",
      tone: "warm"
    });
  });

  it.each([
    createInput("energized", ["work_stress"]),
    createInput("content", ["wallet_pressure"]),
    createInput("joyful", ["want_to_rest"])
  ])("keeps positive branch selection deterministic for %#", (input) => {
    expect(generateCompanionReply(input)).toEqual(generateCompanionReply(input));
  });

  it("keeps calm wallet pressure reply practical instead of celebratory", () => {
    expect(generateCompanionReply(createInput("content", ["wallet_pressure"]))).toMatchObject({
      tinyAction: "只看一眼下一個到期日，看完就讓它先躺著。",
      tone: "calm"
    });
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

  it("uses localized pet lines from positive pet states", () => {
    expect([
      "我把小火花收成一格電，陪你留給晚一點的自己。",
      "我今天有一點亮，但還是慢慢走就好。",
      "我把多出來的電抱好，不急著用完。"
    ]).toContain(generateCompanionReply(createInput("energized")).petLine);
    expect([
      "我在旁邊小小揮手，幫你把這一刻記起來。",
      "我把雀躍放進口袋，之後低電量也能摸到一點暖。",
      "我輕輕亮一下，不吵醒這份開心。"
    ]).toContain(generateCompanionReply(createInput("joyful")).petLine);
    expect([
      "我在小太陽旁邊慢慢晃，陪你待在剛剛好。",
      "我瞇眼曬一下暖暖的光，不用急著去哪裡。",
      "我把這份平靜抱在肚子前面，慢慢呼吸。"
    ]).toContain(generateCompanionReply(createInput("content")).petLine);
  });
});
