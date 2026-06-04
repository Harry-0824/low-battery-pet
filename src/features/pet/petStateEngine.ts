import type { DerivedUserState } from "../checkIn/checkInTypes";
import type { PetState } from "./petTypes";

const idleState: PetState = {
  mood: "idle",
  animation: "idle",
  effect: "none",
  accessory: "none"
};

export const calculatePetState = (derivedState: DerivedUserState): PetState => {
  // Priority order keeps the result deterministic when multiple conditions apply.
  if (derivedState.energyLevel === "critical") {
    return {
      mood: "low_power",
      animation: "sleep",
      effect: "low_battery",
      accessory: "none"
    };
  }

  if (derivedState.stressLevel === "high") {
    return {
      mood: "stressed",
      animation: "shake",
      effect: "black_cloud",
      accessory: "none"
    };
  }

  if (derivedState.mood === "lonely") {
    return {
      mood: "lonely",
      animation: "hide",
      effect: "rain",
      accessory: "none"
    };
  }

  if (derivedState.hasWalletPressure) {
    return {
      mood: "grumpy",
      animation: "idle",
      effect: "coins",
      accessory: "coin"
    };
  }

  if (derivedState.needsFoodSuggestion) {
    return {
      mood: "hungry",
      animation: "idle",
      effect: "none",
      accessory: "rice_ball"
    };
  }

  return idleState;
};
