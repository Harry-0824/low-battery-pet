import styled from "styled-components";

import type { CheckInHistoryRecord } from "../features/history/historyTypes";
import {
  formatHistoryContextTags,
  formatHistoryPetSummary,
  formatHistoryReplySummary
} from "../features/history/historyView";

interface HistoryCardProps {
  record: CheckInHistoryRecord;
}

function HistoryCard({ record }: HistoryCardProps) {
  return (
    <Card data-testid="history-card">
      <CreatedAt>{record.createdAt}</CreatedAt>
      <HistoryLine>moodTag: {record.moodTag}</HistoryLine>
      <HistoryLine>contexts: {formatHistoryContextTags(record)}</HistoryLine>
      <HistoryLine>pet: {formatHistoryPetSummary(record)}</HistoryLine>
      <HistoryLine>reply: {formatHistoryReplySummary(record)}</HistoryLine>
    </Card>
  );
}

const Card = styled.article`
  display: grid;
  gap: 8px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 14px;
  background: #ffffff;
`;

const CreatedAt = styled.p`
  margin: 0;
  color: #5f6b7a;
  font-size: 0.84rem;
  line-height: 1.35;
`;

const HistoryLine = styled.p`
  margin: 0;
  color: #243142;
  line-height: 1.45;
`;

export default HistoryCard;
