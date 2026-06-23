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
