import styled from "styled-components";

/**
 * CheckInForm.styles.ts
 *
 * CheckInForm 表單的樣式：
 * - Form: 表單外框
 * - Section: 每個表單區域（心情/情境）的容器
 * - ButtonGrid: 按鈕網格，手機版改為兩欄
 * - HelperText: 輔助提示文字（未選擇心情或送出中）
 * - SubmitButton: 送出按鈕，有忙等狀態樣式
 */

export const Form = styled.form`
  display: grid;
  gap: 16px;
  border: 1px solid #d7dde6;
  border-radius: 12px;
  padding: 14px;
  background: #f8fafc;

  @media (max-width: 420px) {
    gap: 12px;
    padding: 12px;
  }
`;

export const Section = styled.fieldset`
  display: grid;
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  background: #ffffff;
  margin: 0;

  legend {
    padding: 0;
    color: #243142;
    font-weight: 800;
    margin: 0;
    font-size: 1rem;
  }
`;

export const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 420px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
`;

export const HelperText = styled.p`
  margin: 0;
  color: #7c2d12;
  font-size: 0.94rem;
  font-weight: 700;
  line-height: 1.45;
`;

export const SubmitButton = styled.button`
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  padding: 12px 16px;
  background: #f28c52;
  color: #fff7ed;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease, opacity 160ms ease;

  &:hover:not(:disabled) {
    background: #e5773f;
  }

  &:focus-visible {
    outline: 3px solid rgba(35, 51, 72, 0.35);
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  &[aria-busy="true"] {
    background: #d97f4c;
    box-shadow: inset 0 0 0 2px rgba(255, 247, 237, 0.28);
    opacity: 0.88;
    transform: translateY(1px);
  }
`;
