import styled from "styled-components";

import type { PetState } from "../features/pet/petTypes";

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
      status: "小電量獸腦袋當機"
    };
  }

  return {
    face: "( -_- )",
    status: "小電量獸待機中"
  };
};

const Display = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 18px;
  background: #f2f5f8;
  text-align: center;
`;

const PixelPetVisual = styled.div`
  --pet-body: #f28c52;
  --pet-highlight: #fff7ed;
  --pet-outline: #243142;
  --stage-floor: #d7dde6;
  --battery-fill: #7ac48a;
  --body-left: 39px;
  --body-bottom: 20px;
  --body-width: 58px;
  --body-height: 42px;
  --body-transform: translateY(0);
  --eye-height: 8px;
  --eye-top: 13px;
  --mouth-width: 16px;
  --mouth-height: 4px;
  --mouth-top: 27px;
  --mouth-transform: translateX(-50%);
  --battery-opacity: 0;
  --battery-fill-width: 65%;
  --cloud-opacity: 0;
  --spark-opacity: 0;
  --corner-opacity: 0;

  position: relative;
  width: 136px;
  height: 96px;
  image-rendering: pixelated;

  &::after {
    position: absolute;
    right: 18px;
    bottom: 10px;
    left: 18px;
    height: 4px;
    background: var(--stage-floor);
    box-shadow: 12px 4px 0 #c8d0dc;
    content: "";
  }

  &[data-visual-state="drained"] {
    --pet-body: #a8b5c7;
    --pet-highlight: #e5eaf0;
    --battery-fill: #d94c4c;
    --body-left: 34px;
    --body-bottom: 16px;
    --body-width: 68px;
    --body-height: 32px;
    --body-transform: rotate(-4deg);
    --eye-height: 3px;
    --eye-top: 12px;
    --mouth-width: 20px;
    --mouth-height: 3px;
    --mouth-top: 22px;
    --battery-opacity: 1;
    --battery-fill-width: 18%;
  }

  &[data-visual-state="overloaded"] {
    --pet-body: #ee6f61;
    --pet-highlight: #ffe2dd;
    --eye-height: 10px;
    --eye-top: 11px;
    --mouth-width: 20px;
    --mouth-height: 8px;
    --mouth-top: 27px;
    --cloud-opacity: 1;
    --spark-opacity: 1;
  }

  &[data-visual-state="lonely"] {
    --pet-body: #8fb3d9;
    --pet-highlight: #dcecff;
    --body-left: 48px;
    --eye-height: 6px;
    --mouth-width: 12px;
    --corner-opacity: 1;
  }

  &[data-visual-state="low"] {
    --pet-body: #f1b45f;
    --pet-highlight: #fff0cf;
    --battery-fill: #f2c94c;
    --eye-height: 6px;
    --mouth-width: 18px;
    --mouth-transform: translateX(-50%) rotate(180deg);
    --battery-opacity: 1;
    --battery-fill-width: 38%;
  }
`;

const PixelBody = styled.div`
  position: absolute;
  bottom: var(--body-bottom);
  left: var(--body-left);
  z-index: 1;
  width: var(--body-width);
  height: var(--body-height);
  border: 4px solid var(--pet-outline);
  background: var(--pet-body);
  box-shadow: inset 8px 0 0 var(--pet-highlight), 0 4px 0 rgba(36, 49, 66, 0.16);
  transform: var(--body-transform);
  transform-origin: 50% 100%;

  &::before,
  &::after {
    position: absolute;
    top: -15px;
    width: 12px;
    height: 12px;
    border: 4px solid var(--pet-outline);
    border-bottom: 0;
    background: var(--pet-body);
    content: "";
  }

  &::before {
    left: 7px;
  }

  &::after {
    right: 7px;
  }
`;

const PixelEye = styled.span<{ $side: "left" | "right" }>`
  position: absolute;
  top: var(--eye-top);
  ${({ $side }) => ($side === "left" ? "left: 15px;" : "right: 15px;")}
  width: 8px;
  height: var(--eye-height);
  background: var(--pet-outline);
`;

const PixelMouth = styled.span`
  position: absolute;
  top: var(--mouth-top);
  left: 50%;
  width: var(--mouth-width);
  height: var(--mouth-height);
  border-bottom: 4px solid var(--pet-outline);
  transform: var(--mouth-transform);
`;

const PixelBattery = styled.div`
  position: absolute;
  right: 16px;
  bottom: 26px;
  width: 26px;
  height: 16px;
  border: 3px solid var(--pet-outline);
  background: #fff7ed;
  opacity: var(--battery-opacity);

  &::before {
    position: absolute;
    top: 4px;
    right: -7px;
    width: 4px;
    height: 6px;
    background: var(--pet-outline);
    content: "";
  }

  &::after {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: var(--battery-fill-width);
    background: var(--battery-fill);
    content: "";
  }
`;

const PixelCloud = styled.div`
  position: absolute;
  top: 10px;
  left: 62px;
  width: 18px;
  height: 14px;
  background: #5f6b7a;
  box-shadow: 12px 0 0 #5f6b7a, 6px -6px 0 #5f6b7a, 3px 12px 0 #8b95a3;
  opacity: var(--cloud-opacity);
`;

const PixelSpark = styled.div<{ $placement: "left" | "right" }>`
  position: absolute;
  top: ${({ $placement }) => ($placement === "left" ? "22px" : "28px")};
  ${({ $placement }) => ($placement === "left" ? "left: 24px;" : "right: 24px;")}
  width: 6px;
  height: 16px;
  background: #f2c94c;
  box-shadow: 6px 6px 0 #f28c52;
  opacity: var(--spark-opacity);
`;

const PixelCorner = styled.div`
  position: absolute;
  right: 14px;
  bottom: 18px;
  width: 26px;
  height: 34px;
  border-right: 4px solid #aeb8c7;
  border-bottom: 4px solid #aeb8c7;
  opacity: var(--corner-opacity);
`;

const PetFace = styled.pre`
  margin: 0;
  color: #243142;
  font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  font-size: 2rem;
  line-height: 1.1;
  white-space: pre-wrap;
`;

const StatusText = styled.p`
  margin: 0;
  color: #243142;
  font-weight: 800;
  line-height: 1.45;
`;

export default PetDisplay;
