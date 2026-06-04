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

  it("returns an idle pet state for the neutral baseline", () => {
    expect(calculatePetState(createDerivedState())).toEqual({
      mood: "idle",
      animation: "idle",
      effect: "none",
      accessory: "none"
    });
  });
});
