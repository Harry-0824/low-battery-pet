import type { CheckInHistoryRecord } from "../features/history/historyTypes";
import { CardList, ClearButton, HistoryHeader, HistorySection } from "./HistoryList.styles";
import EmptyHistoryState, { type EmptyHistoryStateKind } from "./EmptyHistoryState";
import HistoryCard from "./HistoryCard";

interface HistoryListProps {
  records: CheckInHistoryRecord[];
  emptyStateKind: EmptyHistoryStateKind;
  onClear: () => void;
}

function HistoryList({ records, emptyStateKind, onClear }: HistoryListProps) {
  const visibleRecords = records.slice(0, 3);
  const historyTitleId = "history-title";

  return (
    <HistorySection aria-labelledby={historyTitleId}>
      <HistoryHeader>
        <h2 id={historyTitleId}>最近被接住的時候</h2>
        {records.length > 0 ? (
          <ClearButton type="button" onClick={onClear}>
            放下這些紀錄
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
        <EmptyHistoryState kind={emptyStateKind} />
      )}
    </HistorySection>
  );
}

export default HistoryList;
