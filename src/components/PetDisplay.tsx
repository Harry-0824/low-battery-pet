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
  StatusText
} from "./PetDisplay.styles";

interface PetDisplayProps {
  petState: PetState;
}

interface PetDisplayCopy {
  face: string;
  status: string;
}

type PetVisualState = "okay" | "drained" | "overloaded" | "lonely" | "low";

function PetDisplay({ petState }: PetDisplayProps) {
  const display = getPetDisplay(petState);
  const visualState = getPetVisualState(petState);

  return (
    <Display aria-label="小電量獸狀態">
      <PixelPetVisual
        aria-hidden="true"
        data-testid="pixel-pet-visual"
        data-visual-state={visualState}
      >
        <PixelCloud />
        <PixelSpark $placement="left" />
        <PixelSpark $placement="right" />
        <PixelBattery />
        <PixelCorner />
        <PixelBody>
          <PixelEye $side="left" />
          <PixelEye $side="right" />
          <PixelMouth />
        </PixelBody>
      </PixelPetVisual>
      <PetFace aria-hidden="true">{display.face}</PetFace>
      <StatusText>{display.status}</StatusText>
    </Display>
  );
}

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

  return "okay";
};

export const getPetDisplay = (petState: PetState): PetDisplayCopy => {
  if (petState.accessory === "rice_ball") {
    return {
      face: "( ´・ω・)つ🍙",
      status: "小電量獸抱著飯糰"
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
