/**
 * 寵物狀態型別定義
 *
 * PetState 是寵物在畫面上呈現的完整狀態，
 * 包含情緒、動畫、視覺特效和配件。
 */

/** 寵物的情緒狀態 */
export type PetMoodState =
  | "idle"
  | "low_power"
  | "stressed"
  | "lonely"
  | "grumpy"
  | "hungry";

/** 寵物的動畫類型 */
export type PetAnimation = "idle" | "sleep" | "shake" | "hide";

/** 寵物身上的視覺特效 */
export type PetVisualEffect =
  | "none"
  | "low_battery"
  | "black_cloud"
  | "rain"
  | "coins";

/** 寵物手持/穿戴的配件 */
export type PetAccessory = "none" | "coin" | "rice_ball";

/**
 * 寵物在畫面上的完整狀態描述
 *
 * 這個物件會傳給 PetDisplay 元件，
 * 用來決定寵物的表情文字和視覺樣式。
 */
export interface PetState {
  mood: PetMoodState;
  animation: PetAnimation;
  effect: PetVisualEffect;
  accessory: PetAccessory;
}
