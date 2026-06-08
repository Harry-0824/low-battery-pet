import styled from "styled-components";

function EmptyHistoryState() {
  return (
    <EmptyState>
      <p>No saved check-ins yet.</p>
    </EmptyState>
  );
}

const EmptyState = styled.div`
  border: 1px dashed #c7d0dc;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
  color: #5f6b7a;

  p {
    margin: 0;
  }
`;

export default EmptyHistoryState;
