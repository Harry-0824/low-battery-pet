import { describe, expect, it } from "vitest";

import type { PetState } from "../features/pet/petTypes";
import { getPetDisplay, getPetVisualState } from "./PetDisplay";

describe("PetDisplay positive visual states", () => {
  it.each([
    {
      petState: {
        mood: "charged",
        animation: "bounce",
        effect: "spark",
        accessory: "none"
      },
      expectedVisualState: "charged",
      expectedFace: "(ﾉ´ヮ`)ﾉ*:･ﾟ✧",
      expectedStatus: "小電量獸把亮亮的電收好"
    },
    {
      petState: {
        mood: "joyful",
        animation: "bounce",
        effect: "spark",
        accessory: "none"
      },
      expectedVisualState: "joyful",
      expectedFace: "( ´ ▽ ` )ﾉ",
      expectedStatus: "小電量獸小小揮手"
    },
    {
      petState: {
        mood: "calm",
        animation: "sway",
        effect: "warm_glow",
        accessory: "sun_dot"
      },
      expectedVisualState: "calm",
      expectedFace: "( ´･ᴗ･` )",
      expectedStatus: "小電量獸瞇眼曬太陽"
    }
  ] satisfies Array<{
    petState: PetState;
    expectedVisualState: string;
    expectedFace: string;
    expectedStatus: string;
  }>)(
    "maps $expectedVisualState to its positive display state",
    ({ petState, expectedVisualState, expectedFace, expectedStatus }) => {
      expect(getPetVisualState(petState)).toBe(expectedVisualState);
      expect(getPetDisplay(petState)).toEqual({
        face: expectedFace,
        status: expectedStatus
      });
    }
  );
});
