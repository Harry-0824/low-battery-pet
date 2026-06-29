import styled from "styled-components";

/**
 * TagButton.styles.ts
 *
 * 心情和情境標籤按鈕的樣式：
 * - 選中時有深色漸層和焦點環
 * - 未選中時是白色背景
 * - 手機版按鈕寬度 100%
 */

const polarityColor = {
  positive: "#f4c95d",
  neutral: "#9fb2c3",
  negative: "#6f8798"
};

export const Button = styled.button<{
  $isSelected: boolean;
  $polarity: "positive" | "neutral" | "negative";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  min-height: 44px;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? "#111827" : "#d7dde6")};
  border-radius: 999px;
  padding: 9px 13px 9px 17px;
  background: ${({ $isSelected }) =>
    $isSelected ? "linear-gradient(180deg, #233348 0%, #111827 100%)" : "#ffffff"};
  color: ${({ $isSelected }) => ($isSelected ? "#ffffff" : "#243142")};
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
  box-shadow: ${({ $isSelected }) =>
    $isSelected ? "inset 0 -2px 0 rgba(255, 255, 255, 0.12)" : "none"};

  &::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 9px;
    bottom: 9px;
    width: 4px;
    border-radius: 999px;
    background: ${({ $polarity }) => polarityColor[$polarity]};
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0.76)};
  }

  @media (max-width: 420px) {
    width: 100%;
    padding: 9px 8px;
  }

  &:focus-visible {
    outline: 3px solid rgba(242, 140, 82, 0.45);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
