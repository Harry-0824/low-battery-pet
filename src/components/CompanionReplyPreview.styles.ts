import styled from "styled-components";

/**
 * CompanionReplyPreview.styles.ts
 *
 * 陪伴回覆區塊的樣式：
 * - PreviewPanel: 回覆內容的外框
 * - ReplyGroup: 同一組標題+文字的區塊（「牠說」和「一件小事」）
 * - PreviewLine: 回覆文字的單行樣式
 */

export const PreviewPanel = styled.div`
  display: grid;
  gap: 14px;
`;

export const ReplyGroup = styled.div`
  display: grid;
  gap: 6px;

  h2 {
    margin: 0;
    font-size: 1rem;
    color: #243142;
  }
`;

export const PreviewLine = styled.p`
  margin: 0;
  color: #374151;
  line-height: 1.55;
`;

export const ActionStage = styled.div<{ $isDone: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  margin-top: 4px;
`;

export const PetLift = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  color: #5f6b7a;
  font-size: 0.82rem;
  font-weight: 800;
  transform: translateY(0);

  ${ActionStage}[data-action-state="done"] & {
    animation: petLift 560ms ease both;
  }

  @keyframes petLift {
    0% {
      transform: translateY(0);
    }

    45% {
      transform: translateY(-5px);
    }

    100% {
      transform: translateY(-2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

export const MicroBurst = styled.span`
  position: absolute;
  left: 34px;
  top: -5px;
  display: inline-flex;
  gap: 5px;
  color: #b7791f;
  font-size: 0.82rem;
  pointer-events: none;

  span {
    animation: floatUp 680ms ease both;
  }

  span:nth-child(2) {
    animation-delay: 80ms;
  }

  span:nth-child(3) {
    animation-delay: 150ms;
  }

  @keyframes floatUp {
    0% {
      opacity: 0;
      transform: translateY(4px) scale(0.9);
    }

    35% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translateY(-12px) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    span {
      animation: none !important;
    }
  }
`;

export const ActionButton = styled.button`
  min-height: 38px;
  border: 1px solid #d7dde6;
  border-radius: 999px;
  padding: 8px 12px;
  background: #ffffff;
  color: #243142;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;

  &:hover:not(:disabled) {
    border-color: #9fb2c3;
    background: #f8fafc;
  }

  &:focus-visible {
    outline: 3px solid rgba(242, 140, 82, 0.35);
    outline-offset: 3px;
  }

  &:disabled {
    cursor: default;
    border-color: #f4c95d;
    background: #fff8dc;
    color: #7c4a03;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
