import type { CSSProperties } from "react";

import type { CheckInHistoryRecord } from "../features/history/historyTypes";
import {
  formatHistoryContextTags,
  formatHistoryCreatedAt,
  formatHistoryPetSummary,
  formatHistoryReplySummary
} from "../features/history/historyView";
import { Card, CardHeader, CreatedAt, DayActionButton, HistoryLine } from "./HistoryCard.styles";

/**
 * HistoryCard 元件
 *
 * 渲染單一歷史紀錄卡片，包含：
 * - 建立時間和刪除按鈕（...）
 * - 心情與情境標籤
 * - 寵物狀態摘要
 * - 陪伴回覆摘要
 *
 * 使用者可以點擊刪除按鈕，確認後只刪除「這一天」的所有紀錄，
 * 保留其他日期的紀錄。
 */
interface HistoryCardProps {
  record: CheckInHistoryRecord;
  onDeleteDay: (createdAt: string) => void;
  releaseIndex?: number;
}

function HistoryCard({ record, onDeleteDay, releaseIndex = 0 }: HistoryCardProps) {
  const createdAtLabel = formatHistoryCreatedAt(record.createdAt);

  const handleDeleteDay = () => {
    if (window.confirm("保留其他，只清這天？")) {
      onDeleteDay(record.createdAt);
    }
  };

  return (
    <Card
      data-testid="history-card"
      style={{ "--release-index": releaseIndex } as CSSProperties}
    >
      <CardHeader>
        <CreatedAt>{createdAtLabel}</CreatedAt>
        <DayActionButton
          type="button"
          aria-label={`清除 ${createdAtLabel} 的紀錄`}
          title="保留其他，只清這天"
          onClick={handleDeleteDay}
        >
          ...
        </DayActionButton>
      </CardHeader>
      <HistoryLine>{formatHistoryContextTags(record)}</HistoryLine>
      <HistoryLine>{formatHistoryPetSummary(record)}</HistoryLine>
      <HistoryLine>{formatHistoryReplySummary(record)}</HistoryLine>
    </Card>
  );
}

export default HistoryCard;
