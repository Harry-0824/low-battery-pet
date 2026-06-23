import styled from "styled-components";

/**
 * HistoryCard.styles.ts
 *
 * 單一歷史紀錄卡片的樣式：
 * - Card: 卡片外框，有 hover/focus-within 效果
 * - CardHeader: 頂部時間和刪除按鈕的排列
 * - CreatedAt: 建立時間的文字樣式
 * - DayActionButton: 刪除單日紀錄的小按鈕
 * - HistoryLine: 卡片內每行文字的樣式
 */

export const Card = styled.article`
  display: grid;
  gap: 8px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 14px;
  background: #ffffff;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &:hover,
  &:focus-within {
    border-color: #f6c667;
    box-shadow: 0 8px 18px rgba(36, 49, 66, 0.1);
    transform: translateY(-1px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:focus-within {
      transform: none;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 8px;
`;

export const CreatedAt = styled.p`
  margin: 0;
  color: #5f6b7a;
  font-size: 0.84rem;
  line-height: 1.35;
`;

export const DayActionButton = styled.button`
  min-width: 32px;
  min-height: 28px;
  border: 1px solid #d7dde6;
  border-radius: 999px;
  padding: 0 8px;
  background: #f8fafc;
  color: #5f6b7a;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  line-height: 1;

  &:hover {
    background: #eef2f7;
  }

  &:focus-visible {
    outline: 3px solid rgba(95, 107, 122, 0.25);
    outline-offset: 3px;
  }
`;

export const HistoryLine = styled.p`
  margin: 0;
  color: #243142;
  line-height: 1.45;
`;
