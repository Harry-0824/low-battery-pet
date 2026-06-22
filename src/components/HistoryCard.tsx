import type { CheckInHistoryRecord } from "../features/history/historyTypes";
import {
  formatHistoryContextTags,
  formatHistoryCreatedAt,
  formatHistoryPetSummary,
  formatHistoryReplySummary
} from "../features/history/historyView";
import { Card, CardHeader, CreatedAt, DayActionButton, HistoryLine } from "./HistoryCard.styles";

interface HistoryCardProps {
  record: CheckInHistoryRecord;
  onDeleteDay: (createdAt: string) => void;
}

function HistoryCard({ record, onDeleteDay }: HistoryCardProps) {
  const createdAtLabel = formatHistoryCreatedAt(record.createdAt);

  const handleDeleteDay = () => {
    if (window.confirm("保留其他，只清這天？")) {
      onDeleteDay(record.createdAt);
    }
  };

  return (
    <Card data-testid="history-card">
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
