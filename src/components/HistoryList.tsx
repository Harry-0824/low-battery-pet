import styled from "styled-components";

import type { CheckInHistoryRecord } from "../features/history/historyTypes";
import EmptyHistoryState from "./EmptyHistoryState";
import HistoryCard from "./HistoryCard";

interface HistoryListProps {
  records: CheckInHistoryRecord[];
  onClear: () => void;
}

function HistoryList({ records, onClear }: HistoryListProps) {
  const visibleRecords = records.slice(0, 3);

  return (
    <HistorySection>
      <HistoryHeader>
        <h2>最近被接住的時候</h2>
        {records.length > 0 ? (
          <ClearButton type="button" onClick={onClear}>
            清空紀錄
          </ClearButton>
        ) : null}
      </HistoryHeader>
      {records.length > 0 ? (
        <CardList>
          {visibleRecords.map((record) => (
            <HistoryCard key={record.createdAt} record={record} />
          ))}
        </CardList>
      ) : (
        <EmptyHistoryState />
      )}
    </HistorySection>
  );
}

const HistorySection = styled.section`
  display: grid;
  gap: 14px;
  margin-top: 24px;
`;

const HistoryHeader = styled.div`
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

const ClearButton = styled.button`
  min-height: 40px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 8px 12px;
  background: #ffffff;
  color: #243142;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
`;

const CardList = styled.div`
  display: grid;
  gap: 12px;
`;

export default HistoryList;
