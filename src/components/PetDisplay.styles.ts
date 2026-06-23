import styled from "styled-components";

/**
 * PetDisplay.styles.ts
 *
 * 小電量獸視覺呈現的樣式：
 * - Display: 寵物區塊的外框
 * - PetFace: 表情文字（如 (x_x)）
 * - StatusText: 狀態描述文字
 * - PixelPetVisual / PixelCloud / PixelSpark / PixelBattery / PixelCorner / PixelBody / PixelEye / PixelMouth:
 *   用 CSS 繪製的像素風格寵物頭像各部位
 */

export const Display = styled.div`
  display: grid;
  gap: 10px;
  margin: 0 0 18px;
`;

export const PetFace = styled.p`
  margin: 0;
  text-align: center;
  font-size: 1.6rem;
  line-height: 1.2;
`;

export const StatusText = styled.p`
  margin: 0;
  text-align: center;
  font-weight: 800;
  color: #243142;
`;

export const PixelPetVisual = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
`;

export const PixelCloud = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 44px;
  height: 20px;
  background: #e5e7eb;
  border-radius: 10px;
`;

export const PixelSpark = styled.span<{ $placement: "left" | "right" }>`
  position: absolute;
  top: 8px;
  width: 8px;
  height: 8px;
  background: #f6c667;
  border-radius: 999px;
  left: ${({ $placement }) => ($placement === "left" ? "24px" : "88px")};
`;

export const PixelBattery = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 20px;
  border: 3px solid #243142;
  border-radius: 4px;
  background: #7fb069;
`;

export const PixelCorner = styled.div`
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 14px;
  background: #243142;
  border-radius: 999px;
`;

export const PixelBody = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 56px;
  background: #f0d66f;
  border: 3px solid #243142;
  border-radius: 12px;
`;

export const PixelEye = styled.span<{ $side: "left" | "right" }>`
  position: absolute;
  top: 12px;
  width: 10px;
  height: 10px;
  background: #243142;
  border-radius: 999px;
  left: ${({ $side }) => ($side === "left" ? "14px" : "40px")};
`;

export const PixelMouth = styled.span`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 4px;
  background: #243142;
  border-radius: 999px;
`;
