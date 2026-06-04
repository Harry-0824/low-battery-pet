export type PetMoodState =
  | "idle"
  | "low_power"
  | "stressed"
  | "lonely"
  | "grumpy"
  | "hungry";

export type PetAnimation = "idle" | "sleep" | "shake" | "hide";

export type PetVisualEffect =
  | "none"
  | "low_battery"
  | "black_cloud"
  | "rain"
  | "coins";

export type PetAccessory = "none" | "coin" | "rice_ball";

export interface PetState {
  mood: PetMoodState;
  animation: PetAnimation;
  effect: PetVisualEffect;
  accessory: PetAccessory;
}
