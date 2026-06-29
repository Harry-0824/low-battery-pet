import type { PetState } from "../features/pet/petTypes";
import {
  Display,
  PetFace,
  PixelBattery,
  PixelBody,
  PixelCloud,
  PixelCorner,
  PixelEye,
  PixelMouth,
  PixelPetVisual,
  PixelSpark,
  PixelSunDot,
  StatusText
} from "./PetDisplay.styles";

interface PetDisplayProps {
  petState: PetState;
}

interface PetDisplayCopy {
  face: string;
  status: string;
}

type PetVisualState =
  | "okay"
  | "charged"
  | "joyful"
  | "calm"
  | "drained"
  | "overloaded"
  | "lonely"
  | "low";

/**
 * PetDisplay 元件
 *
 * 負責渲染小電量獸的視覺呈現：
 * - PixelPetVisual：用 CSS 繪製的像素風格寵物頭像
 * - PetFace：寵物的表情文字（如 (x_x)）
 * - StatusText：寵物狀態的描述（如「小電量獸快沒電了」）
 *
 * getPetVisualState 和 getPetDisplay 會根據 PetState 的屬性
 * 決定外顯樣子和文字。
 */
function PetDisplay({ petState }: PetDisplayProps) {
  const display = getPetDisplay(petState);
  const visualState = getPetVisualState(petState);

  return (
    <Display aria-label="小電量獸狀態">
      <PixelPetVisual
        aria-hidden="true"
        className={`pet-anim-${petState.animation}`}
        data-testid="pixel-pet-visual"
        data-visual-state={visualState}
      >
        <PixelCloud className="cloud" />
        <PixelSpark className="spark" $placement="left" />
        <PixelSpark className="spark" $placement="right" />
        <PixelSunDot className="sun-dot" />
        <PixelBattery />
        <PixelCorner />
        <PixelBody>
          <PixelEye className="pet-eye" $side="left" />
          <PixelEye className="pet-eye" $side="right" />
          <PixelMouth className="pet-mouth" />
        </PixelBody>
      </PixelPetVisual>
      <PetFace aria-hidden="true">{display.face}</PetFace>
      <StatusText>{display.status}</StatusText>
    </Display>
  );
}

/**
 * 將 PetState 對應到測試用的視覺狀態類別
 *
 * 這些類別會映射到 CSS class 或 data attribute，
 * 讓測試可以驗證寵物呈現的外觀是否符合預期。
 */
export const getPetVisualState = (petState: PetState): PetVisualState => {
  if (petState.mood === "low_power" || petState.effect === "low_battery") {
    return "drained";
  }

  if (
    petState.mood === "stressed" ||
    petState.effect === "black_cloud" ||
    petState.animation === "shake"
  ) {
    return "overloaded";
  }

  if (petState.mood === "lonely" || petState.animation === "hide") {
    return "lonely";
  }

  if (petState.mood === "grumpy" || petState.accessory === "coin") {
    return "low";
  }

  if (petState.mood === "charged") {
    return "charged";
  }

  if (petState.mood === "joyful") {
    return "joyful";
  }

  if (petState.mood === "calm" || petState.accessory === "sun_dot") {
    return "calm";
  }

  return "okay";
};

/**
 * 根據 PetState 決定表情文字和狀態描述
 *
 * 優先檢查 accessory（如飯糰），再檢查 mood 和 effect，
 * 最後是預設的待機狀態。
 */
export const getPetDisplay = (petState: PetState): PetDisplayCopy => {
  if (petState.accessory === "rice_ball") {
    return {
      face: "( ´・ω・)つ🍙",
      status: "小電量獸抱著飯糰"
    };
  }

  if (petState.mood === "charged") {
    return {
      face: "(ﾉ´ヮ`)ﾉ*:･ﾟ✧",
      status: "小電量獸把亮亮的電收好"
    };
  }

  if (petState.mood === "joyful") {
    return {
      face: "( ´ ▽ ` )ﾉ",
      status: "小電量獸小小揮手"
    };
  }

  if (petState.mood === "calm") {
    return {
      face: "( ´･ᴗ･` )",
      status: "小電量獸瞇眼曬太陽"
    };
  }

  if (petState.mood === "low_power") {
    return {
      face: "( x_x )",
      status: "小電量獸快沒電了"
    };
  }

  if (petState.mood === "stressed") {
    return {
      face: "( >_< )",
      status: "小電量獸頭上冒黑雲"
    };
  }

  if (petState.mood === "lonely") {
    return {
      face: "( ._.)",
      status: "小電量獸躲到角落"
    };
  }

  if (petState.mood === "grumpy") {
    return {
      face: "( >皿< )",
      status: "小電量獸炸毛中"
    };
  }

  if (petState.effect === "black_cloud") {
    return {
      face: "( @_@ )",
      status: "小電量獸腦袋空白"
    };
  }

  return {
    face: "( -_- )",
    status: "小電量獸待機中"
  };
};

export default PetDisplay;
