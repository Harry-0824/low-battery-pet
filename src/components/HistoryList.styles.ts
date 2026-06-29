import styled from "styled-components";

/**
 * HistoryList.styles.ts
 *
 * 歷史列表容器的樣式：
 * - HistorySection: 整個歷史區塊
 * - HistoryHeader: 標題 + 清除按鈕的橫向排列
 * - ClearButton: 放下這些紀錄按鈕
 * - HistoryLimitHint: 接近上限時的提示文字
 * - CardList: 歷史卡片的列表容器
 */

export const HistorySection = styled.section`
  display: grid;
  gap: 12px;
  margin: 0 0 22px;
`;

export const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.3;
  }
`;

export const ClearButton = styled.button`
  border: 1px solid #d7dde6;
  border-radius: 999px;
  padding: 4px 10px;
  background: #f8fafc;
  color: #5f6b7a;
  cursor: pointer;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.35;

  &:hover {
    background: #eef2f7;
  }

  &:disabled {
    cursor: default;
    background: #eef2f7;
    color: #6b7280;
  }

  &:focus-visible {
    outline: 3px solid rgba(95, 107, 122, 0.25);
    outline-offset: 3px;
  }
`;

export const HistoryLimitHint = styled.p`
  margin: -4px 0 0;
  color: #5f6b7a;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const CardList = styled.div`
  display: grid;
  gap: 10px;

  &[data-releasing="true"] > * {
    animation: releaseHistoryCard 720ms ease forwards;
    animation-delay: calc(var(--release-index, 0) * 120ms);
  }

  @keyframes releaseHistoryCard {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    70% {
      opacity: 0.45;
      transform: translateY(-10px) scale(0.98);
    }

    100% {
      opacity: 0;
      transform: translateY(-16px) scale(0.96);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-releasing="true"] > * {
      animation: releaseHistoryCardReduced 160ms ease forwards;
      animation-delay: 0ms;
    }
  }

  @keyframes releaseHistoryCardReduced {
    to {
      opacity: 0;
    }
  }
`;

export const ReleaseMessage = styled.p`
  margin: -2px 0 0;
  border: 1px dashed #d7dde6;
  border-radius: 8px;
  padding: 9px 11px;
  background: rgba(248, 250, 252, 0.78);
  color: #5f6b7a;
  font-size: 0.9rem;
  line-height: 1.5;
`;
