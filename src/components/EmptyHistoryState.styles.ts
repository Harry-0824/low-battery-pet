import styled from "styled-components";

/**
 * EmptyHistoryState.styles.ts
 *
 * 空白歷史狀態的樣式：
 * - EmptyState: 居中顯示的容器
 * - EmptyIcon: 圖示文字
 * - EmptyTitle: 標題
 * - EmptyBody: 說明文字
 */

export const EmptyState = styled.div`
  display: grid;
  gap: 8px;
  text-align: center;
  padding: 18px 12px;
`;

export const EmptyIcon = styled.span`
  font-size: 1.6rem;
  line-height: 1;
`;

export const EmptyTitle = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #243142;
`;

export const EmptyBody = styled.p`
  margin: 0;
  color: #5f6b7a;
  line-height: 1.5;
`;
