import styled from "styled-components";

export const HistorySection = styled.section`
  display: grid;
  gap: 14px;
  margin-top: 24px;
`;

export const HistoryHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

export const ClearButton = styled.button`
  min-height: 40px;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 8px 12px;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  font: inherit;
  font-weight: 800;

  &:hover {
    background: #fecaca;
  }
`;

export const CardList = styled.div`
  display: grid;
  gap: 12px;
`;