import styled from "styled-components";

export const Card = styled.article`
  display: grid;
  gap: 8px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 14px;
  background: #ffffff;
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
