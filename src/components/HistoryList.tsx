import type { CheckInHistoryRecord } from "../features/history/historyTypes";
import {
  CHECK_IN_HISTORY_LIMIT_HINT_THRESHOLD,
  CHECK_IN_HISTORY_RECORD_LIMIT
} from "../features/history/historyStorage";
import {
  CardList,
  ClearButton,
  HistoryHeader,
  HistoryLimitHint,
  HistorySection
} from "./HistoryList.styles";
import EmptyHistoryState, { type EmptyHistoryStateKind } from "./EmptyHistoryState";
import HistoryCard from "./HistoryCard";

/**
 * HistoryList 元件
 *
 * 這是歷史紀錄的主要容器，管理顯示邏輯：
 * - 最多只顯示最近 3 筆（避免畫面太長）
 * - 當紀錄數量接近上限（27 筆）時，顯示清理提示
 * - 沒有紀錄時顯示 EmptyHistoryState
 * - 有紀錄時顯示「放下這些紀錄」的清除按鈕
 */
interface HistoryListProps {
  records: CheckInHistoryRecord[];
  emptyStateKind: EmptyHistoryStateKind;
  onClear: () => void;
  onDeleteDay: (createdAt: string) => void;
}

function HistoryList({ records, emptyStateKind, onClear, onDeleteDay }: HistoryListProps) {
  /** 只顯示最近 3 筆，保持畫面節省空間 */
  const visibleRecords = records.slice(0, 3);
  /** 當紀錄數量 >= 27 時，顯示「只保留最近 30 筆」的提示 */
  const shouldShowLimitHint = records.length >= CHECK_IN_HISTORY_LIMIT_HINT_THRESHOLD;
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
      {shouldShowLimitHint ? (
        <HistoryLimitHint>
          只保留最近 {CHECK_IN_HISTORY_RECORD_LIMIT} 筆，舊的會先睡進角落。
        </HistoryLimitHint>
      ) : null}
      {records.length > 0 ? (
        <CardList>
          {visibleRecords.map((record) => (
            <HistoryCard key={record.createdAt} record={record} onDeleteDay={onDeleteDay} />
          ))}
        </CardList>
      ) : (
        <EmptyHistoryState kind={emptyStateKind} />
      )}
    </HistorySection>
  );
}

export default HistoryList;
