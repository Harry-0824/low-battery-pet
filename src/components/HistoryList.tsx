import { useEffect, useRef, useState } from "react";

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
  HistorySection,
  ReleaseMessage
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
  const [isReleasing, setIsReleasing] = useState(false);
  const releaseTimeoutRef = useRef<number | null>(null);
  /** 只顯示最近 3 筆，保持畫面節省空間 */
  const visibleRecords = records.slice(0, 3);
  /** 當紀錄數量 >= 27 時，顯示「只保留最近 30 筆」的提示 */
  const shouldShowLimitHint = records.length >= CHECK_IN_HISTORY_LIMIT_HINT_THRESHOLD;
  const historyTitleId = "history-title";

  useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current !== null) {
        window.clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

  const handleReleaseHistory = () => {
    if (isReleasing) {
      return;
    }

    setIsReleasing(true);
    releaseTimeoutRef.current = window.setTimeout(() => {
      onClear();
      setIsReleasing(false);
      releaseTimeoutRef.current = null;
    }, 720);
  };

  return (
    <HistorySection aria-labelledby={historyTitleId}>
      <HistoryHeader>
        <h2 id={historyTitleId}>最近被接住的時候</h2>
        {records.length > 0 ? (
          <ClearButton type="button" disabled={isReleasing} onClick={handleReleaseHistory}>
            {isReleasing ? "正在收進樹洞" : "放下這些紀錄"}
          </ClearButton>
        ) : null}
      </HistoryHeader>
      {shouldShowLimitHint ? (
        <HistoryLimitHint>
          只保留最近 {CHECK_IN_HISTORY_RECORD_LIMIT} 筆，舊的會先睡進角落。
        </HistoryLimitHint>
      ) : null}
      {records.length > 0 ? (
        <>
          <CardList data-releasing={isReleasing} aria-hidden={isReleasing ? "true" : undefined}>
            {visibleRecords.map((record, index) => (
              <HistoryCard
                key={record.createdAt}
                record={record}
                onDeleteDay={onDeleteDay}
                releaseIndex={index}
              />
            ))}
          </CardList>
          {isReleasing ? (
            <ReleaseMessage aria-live="polite">
              小電量獸把這 7 天輕輕收進樹洞了。
            </ReleaseMessage>
          ) : null}
        </>
      ) : (
        <EmptyHistoryState kind={emptyStateKind} />
      )}
    </HistorySection>
  );
}

export default HistoryList;
