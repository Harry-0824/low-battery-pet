import { describe, expect, it } from "vitest";

import type { DerivedUserState } from "../checkIn/checkInTypes";
import { calculatePetState } from "./petStateEngine";

const createDerivedState = (
  overrides: Partial<DerivedUserState> = {}
): DerivedUserState => ({
  mood: "neutral",
  energyLevel: "normal",
  stressLevel: "low",
  needsComfort: false,
  hasWalletPressure: false,
  needsRest: false,
  needsFoodSuggestion: false,
  ...overrides
});

describe("calculatePetState", () => {
  it("returns a low-power pet state for critical energy", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "tired",
          energyLevel: "critical",
          stressLevel: "medium",
          needsComfort: true
        })
      )
    ).toEqual({
      mood: "low_power",
      animation: "sleep",
      effect: "low_battery",
      accessory: "none"
    });
  });

  it("returns a stressed pet state for high stress", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "angry",
          energyLevel: "low",
          stressLevel: "high",
          needsComfort: true
        })
      )
    ).toEqual({
      mood: "stressed",
      animation: "shake",
      effect: "black_cloud",
      accessory: "none"
    });
  });

  it("returns a lonely pet state for lonely mood", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "lonely",
          energyLevel: "low",
          stressLevel: "medium",
          needsComfort: true
        })
      )
    ).toEqual({
      mood: "lonely",
      animation: "hide",
      effect: "rain",
      accessory: "none"
    });
  });

  it("returns a money-themed pet state for wallet pressure", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "neutral",
          hasWalletPressure: true
        })
      )
    ).toEqual({
      mood: "grumpy",
      animation: "idle",
      effect: "coins",
      accessory: "coin"
    });
  });

  it("returns a food-themed pet accessory when dinner help is needed without a higher-priority state", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "neutral",
          needsFoodSuggestion: true
        })
      )
    ).toEqual({
      mood: "hungry",
      animation: "idle",
      effect: "none",
      accessory: "rice_ball"
    });
  });

  it("keeps the critical-energy state ahead of lower-priority food suggestions", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "tired",
          energyLevel: "critical",
          stressLevel: "medium",
          needsComfort: true,
          needsFoodSuggestion: true
        })
      )
    ).toEqual({
      mood: "low_power",
      animation: "sleep",
      effect: "low_battery",
      accessory: "none"
    });
  });

  it("returns a charged pet state for full positive energy", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "bright",
          energyLevel: "full"
        })
      )
    ).toEqual({
      mood: "charged",
      animation: "bounce",
      effect: "spark",
      accessory: "none"
    });
  });

  it("returns a joyful pet state for bright positive mood after higher priorities", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "bright",
          energyLevel: "normal"
        })
      )
    ).toEqual({
      mood: "joyful",
      animation: "bounce",
      effect: "spark",
      accessory: "none"
    });
  });

  it("returns a calm pet state for content mood after higher priorities", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "content",
          energyLevel: "normal"
        })
      )
    ).toEqual({
      mood: "calm",
      animation: "sway",
      effect: "warm_glow",
      accessory: "sun_dot"
    });
  });

  it("keeps low-priority positive states behind stress and wallet needs", () => {
    expect(
      calculatePetState(
        createDerivedState({
          mood: "bright",
          energyLevel: "full",
          stressLevel: "high",
          hasWalletPressure: true
        })
      )
    ).toEqual({
      mood: "stressed",
      animation: "shake",
      effect: "black_cloud",
      accessory: "none"
    });

    expect(
      calculatePetState(
        createDerivedState({
          mood: "content",
          hasWalletPressure: true
        })
      )
    ).toEqual({
      mood: "grumpy",
      animation: "idle",
      effect: "coins",
      accessory: "coin"
    });
  });

  it("returns an idle pet state for the neutral baseline", () => {
    expect(calculatePetState(createDerivedState())).toEqual({
      mood: "idle",
      animation: "idle",
      effect: "none",
      accessory: "none"
    });
  });
});
