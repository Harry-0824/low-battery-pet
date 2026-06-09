import styled from "styled-components";

export const Field = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 22px;
`;

export const Label = styled.label`
  font-weight: 800;
`;

export const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 12px 14px;
  background: #ffffff;
  color: #243142;
  font: inherit;
  line-height: 1.5;
  resize: vertical;
`;
