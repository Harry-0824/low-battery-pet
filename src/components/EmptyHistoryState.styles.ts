import styled from "styled-components";

export const EmptyState = styled.div`
  display: grid;
  gap: 8px;
  border: 1px dashed #d8b58a;
  border-radius: 8px;
  padding: 18px;
  background: #fff8ed;
  color: #7c4a24;

  p {
    margin: 0;
  }
`;

export const EmptyIcon = styled.span`
  width: 32px;
  height: 32px;
  border: 1px solid #d8b58a;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  background: #fffdf8;
  color: #8a4b21;
  font-weight: 900;
`;

export const EmptyTitle = styled.p`
  color: #5f3216;
  font-weight: 900;
`;

export const EmptyBody = styled.p`
  line-height: 1.55;
`;
