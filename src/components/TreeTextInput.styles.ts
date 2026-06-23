import styled from "styled-components";

/**
 * TreeTextInput.styles.ts
 *
 * 樹洞文字輸入框的樣式：
 * - Field: 表單欄位容器
 * - TextHeader: 標題 + 字數計數器的橫向排列
 * - Label / TextCounter / DrawerNote / TextArea:
 *   標籤、字數顯示、輔助說明和輸入框本身
 */

export const Field = styled.div`
  display: grid;
  gap: 6px;
`;

export const TextHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Label = styled.label`
  font-weight: 800;
  color: #243142;
`;

export const TextCounter = styled.span`
  font-size: 0.84rem;
  color: #5f6b7a;
`;

export const DrawerNote = styled.p`
  margin: 0;
  color: #5f6b7a;
  font-size: 0.9rem;
  line-height: 1.45;
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 10px;
  background: #ffffff;
  color: #1f2937;
  font: inherit;
  line-height: 1.5;
  resize: vertical;

  &:focus {
    outline: 3px solid rgba(95, 107, 122, 0.25);
    outline-offset: 3px;
  }
`;
