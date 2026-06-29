import styled, { keyframes } from "styled-components";

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

const petBounce = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
`;

const petSway = keyframes`
  0%,
  100% {
    transform: rotate(-1deg);
  }

  50% {
    transform: rotate(1.5deg);
  }
`;

const sparkTwinkle = keyframes`
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1.18);
  }
`;

export const PixelPetVisual = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;

  &[data-visual-state="charged"],
  &[data-visual-state="joyful"] {
    .cloud {
      background: #fde68a;
    }

    .spark {
      opacity: 1;
      box-shadow: 0 0 0 4px rgba(246, 198, 103, 0.2);
    }
  }

  &[data-visual-state="charged"] {
    filter: drop-shadow(0 8px 14px rgba(246, 198, 103, 0.22));
  }

  &[data-visual-state="joyful"] {
    filter: drop-shadow(0 8px 14px rgba(127, 176, 105, 0.18));

    .pet-mouth {
      height: 8px;
      border-radius: 0 0 999px 999px;
    }
  }

  &[data-visual-state="calm"] {
    filter: drop-shadow(0 8px 14px rgba(245, 158, 11, 0.16));

    .cloud {
      background: #fed7aa;
    }

    .spark {
      opacity: 0;
    }

    .sun-dot {
      opacity: 1;
    }

    .pet-eye {
      top: 16px;
      height: 4px;
      border-radius: 999px;
    }

    .pet-mouth {
      width: 16px;
      height: 3px;
      opacity: 0.75;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &.pet-anim-bounce {
      animation: ${petBounce} 1.8s ease-in-out infinite;
    }

    &.pet-anim-sway {
      animation: ${petSway} 2.8s ease-in-out infinite;
      transform-origin: 50% 90%;
    }

    &[data-visual-state="charged"] .spark,
    &[data-visual-state="joyful"] .spark {
      animation: ${sparkTwinkle} 1.4s ease-in-out infinite;
    }
  }
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
  opacity: 0.65;
`;

export const PixelSunDot = styled.span`
  position: absolute;
  top: 2px;
  right: 30px;
  width: 14px;
  height: 14px;
  background: #f59e0b;
  border-radius: 999px;
  box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.16);
  opacity: 0;
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
