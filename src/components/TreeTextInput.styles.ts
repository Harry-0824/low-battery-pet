import styled from "styled-components";

export const Field = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 22px;
  border: 1px solid #d8b58a;
  border-radius: 12px;
  padding: 14px;
  background: linear-gradient(180deg, #fff8ed 0%, #fff3df 100%);
  box-shadow: inset 0 -8px 0 rgba(138, 75, 33, 0.08);
`;

export const TextHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

export const Label = styled.label`
  color: #5f3216;
  font-weight: 800;
`;

export const TextCounter = styled.span`
  color: #8a4b21;
  font-size: 0.82rem;
  font-weight: 800;
`;

export const DrawerNote = styled.p`
  margin: 0;
  color: #7c4a24;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #c58f5d;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fffdf8;
  color: #243142;
  font: inherit;
  line-height: 1.5;
  resize: vertical;

  &:focus {
    outline: 3px solid rgba(242, 140, 82, 0.3);
    outline-offset: 2px;
  }
`;
