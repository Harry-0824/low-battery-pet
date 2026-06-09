import type { CheckInHistoryRecord } from "../features/history/historyTypes";
import {
  formatHistoryContextTags,
  formatHistoryCreatedAt,
  formatHistoryPetSummary,
  formatHistoryReplySummary
} from "../features/history/historyView";
import { Card, CreatedAt, HistoryLine } from "./HistoryCard.styles";

interface HistoryCardProps {
  record: CheckInHistoryRecord;
}

function HistoryCard({ record }: HistoryCardProps) {
  return (
    <Card data-testid="history-card">
      <CreatedAt>{formatHistoryCreatedAt(record.createdAt)}</CreatedAt>
      <HistoryLine>{formatHistoryContextTags(record)}</HistoryLine>
      <HistoryLine>{formatHistoryPetSummary(record)}</HistoryLine>
      <HistoryLine>{formatHistoryReplySummary(record)}</HistoryLine>
    </Card>
  );
}

export default HistoryCard;
