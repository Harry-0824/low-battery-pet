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
      expectedReply: "Steady enough counts. I can sit here with you while you keep the pace small."
    },
    {
      moodTag: "low_battery",
      expectedTone: "soft",
      expectedReply: "Your battery sounds low. No big moves first, just one tiny reset."
    },
    {
      moodTag: "annoyed",
      expectedTone: "grounding",
      expectedReply: "That irritation is allowed to exist. We can lower the heat before choosing anything."
    },
    {
      moodTag: "lonely",
      expectedTone: "warm",
      expectedReply: "Lonely evenings feel heavier. I am here, and you do not have to perform."
    },
    {
      moodTag: "no_thoughts",
      expectedTone: "minimal",
      expectedReply: "No thoughts is still a signal. Let us make the next step very small."
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
      tinyAction: "Open one bill or balance, then stop after naming the next due date."
    });
  });

  it("uses the dinner problem tiny action when dinner help is needed", () => {
    expect(generateCompanionReply(createInput("okay", ["dinner_problem"]))).toMatchObject({
      tinyAction: "Pick the easiest warm option available, even if it is not perfect."
    });
  });

  it("uses the rest tiny action when rest is requested", () => {
    expect(generateCompanionReply(createInput("okay", ["want_to_rest"]))).toMatchObject({
      tinyAction: "Set a 10 minute no-output rest block and put the phone face down."
    });
  });
});
