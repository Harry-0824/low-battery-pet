import { describe, expect, it } from "vitest";
import { deriveUserState } from "./deriveUserState";

/**
 * deriveUserState 模組的單元測試
 *
 * 驗證心情標籤和情境標籤如何組合推导出使用者的內在狀態。
 */

describe("deriveUserState", () => {
  it("maps okay to neutral state without extra needs", () => {
    const result = deriveUserState({ moodTag: "okay", contextTags: [] });

    expect(result).toEqual({
      mood: "neutral",
      energyLevel: "normal",
      stressLevel: "low",
      needsComfort: false,
      hasWalletPressure: false,
      needsRest: false,
      needsFoodSuggestion: false
    });
  });

  it("keeps base low_battery state and sets comfort need", () => {
    const result = deriveUserState({ moodTag: "low_battery", contextTags: [] });

    expect(result.mood).toBe("tired");
    expect(result.energyLevel).toBe("critical");
    expect(result.needsComfort).toBe(true);
  });

  it("combines mood and context tags for a mixed state", () => {
    const result = deriveUserState({
      moodTag: "lonely",
      contextTags: ["work_stress", "wallet_pressure"]
    });

    expect(result.mood).toBe("lonely");
    expect(result.stressLevel).toBe("high");
    expect(result.hasWalletPressure).toBe(true);
  });

  it("ignores unknown context tags and keeps base mood state", () => {
    const result = deriveUserState({
      moodTag: "no_thoughts",
      contextTags: ["unknown_tag" as never]
    });

    expect(result.mood).toBe("overloaded");
    expect(result.energyLevel).toBe("low");
  });

  it("maps energized to a full bright state without comfort needs", () => {
    const result = deriveUserState({
      moodTag: "energized",
      contextTags: ["small_win", "connected"]
    });

    expect(result).toEqual({
      mood: "bright",
      energyLevel: "full",
      stressLevel: "low",
      needsComfort: false,
      hasWalletPressure: false,
      needsRest: false,
      needsFoodSuggestion: false
    });
  });

  it("keeps positive mood gentle when work stress is also selected", () => {
    const result = deriveUserState({
      moodTag: "joyful",
      contextTags: ["work_stress"]
    });

    expect(result.mood).toBe("bright");
    expect(result.energyLevel).toBe("normal");
    expect(result.stressLevel).toBe("high");
    expect(result.needsComfort).toBe(false);
  });

  it("maps content to a calm content state and keeps rest context", () => {
    const result = deriveUserState({
      moodTag: "content",
      contextTags: ["rested_well", "want_to_rest"]
    });

    expect(result.mood).toBe("content");
    expect(result.energyLevel).toBe("normal");
    expect(result.stressLevel).toBe("low");
    expect(result.needsRest).toBe(true);
  });
});
