import styled from "styled-components";

import type { PetState } from "../features/pet/petTypes";

interface PetDisplayProps {
  petState: PetState;
}

interface PetDisplayCopy {
  face: string;
  status: string;
}

function PetDisplay({ petState }: PetDisplayProps) {
  const display = getPetDisplay(petState);

  return (
    <Display aria-label="小電量獸狀態">
      <PetFace aria-hidden="true">{display.face}</PetFace>
      <StatusText>{display.status}</StatusText>
    </Display>
  );
}

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
