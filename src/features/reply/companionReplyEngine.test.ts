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
    expectedReply: string;
  }> = [
    {
      moodTag: "okay",
      expectedTone: "calm",
      expectedReply: "能穩穩撐住也算數。我會坐在旁邊，陪你把步調放小。"
    },
    {
      moodTag: "low_battery",
      expectedTone: "soft",
      expectedReply: "你的電量聽起來很低。先不用做大事，從一個很小的重開機開始。"
    },
    {
      moodTag: "annoyed",
      expectedTone: "grounding",
      expectedReply: "煩躁可以先存在。我們先把火降下來，再決定下一步。"
    },
    {
      moodTag: "lonely",
      expectedTone: "warm",
      expectedReply: "孤單的夜晚會比較重。我在這裡，你不用努力表現得很好。"
    },
    {
      moodTag: "no_thoughts",
      expectedTone: "minimal",
      expectedReply: "腦袋空白也是一種訊號。我們把下一步縮到很小就好。"
    }
  ];

  it.each(moodCases)("maps $moodTag to a deterministic companion reply", ({
    moodTag,
    expectedTone,
    expectedReply
  }) => {
    expect(generateCompanionReply(createInput(moodTag))).toMatchObject({
      tone: expectedTone,
      reply: expectedReply
    });
  });

  it("uses the wallet pressure tiny action when wallet pressure is present", () => {
    expect(generateCompanionReply(createInput("okay", ["wallet_pressure"]))).toMatchObject({
      tinyAction: "打開一張帳單或餘額，看見下一個到期日就先停。"
    });
  });

  it("uses the dinner problem tiny action when dinner help is needed", () => {
    expect(generateCompanionReply(createInput("okay", ["dinner_problem"]))).toMatchObject({
      tinyAction: "選現在最容易取得的熱食，不用完美。"
    });
  });

  it("uses the rest tiny action when rest is requested", () => {
    expect(generateCompanionReply(createInput("okay", ["want_to_rest"]))).toMatchObject({
      tinyAction: "設一個 10 分鐘不用產出的休息，把手機螢幕朝下。"
    });
  });

  it("uses localized pet lines from the existing pet state", () => {
    expect(generateCompanionReply(createInput("okay"))).toMatchObject({
      petLine: "我會待在旁邊，慢慢眨眼。"
    });
    expect(generateCompanionReply(createInput("low_battery"))).toMatchObject({
      petLine: "我先幫你把房間燈光調暗。"
    });
    expect(generateCompanionReply(createInput("annoyed"))).toMatchObject({
      petLine: "小爪子踩在地上。我們先呼吸。"
    });
    expect(generateCompanionReply(createInput("lonely"))).toMatchObject({
      petLine: "我會在你旁邊留一盞小燈。"
    });
    expect(generateCompanionReply(createInput("okay", ["wallet_pressure"]))).toMatchObject({
      petLine: "我陪你一起守住硬幣堆。"
    });
    expect(generateCompanionReply(createInput("okay", ["dinner_problem"]))).toMatchObject({
      petLine: "我找到最小條的晚餐路線了。"
    });
  });
});
