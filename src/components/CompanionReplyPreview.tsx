import styled from "styled-components";

import type { CompanionReply } from "../features/reply/replyTypes";

interface CompanionReplyPreviewProps {
  reply: CompanionReply | null;
}

function CompanionReplyPreview({ reply }: CompanionReplyPreviewProps) {
  if (!reply) {
    return null;
  }

  return (
    <PreviewPanel aria-live="polite">
      <h2>Companion reply</h2>
      <PreviewLine>Reply: {reply.reply}</PreviewLine>
      <PreviewLine>Pet line: {reply.petLine}</PreviewLine>
      <PreviewLine>Tiny action: {reply.tinyAction}</PreviewLine>
      <PreviewLine>Tone: {reply.tone}</PreviewLine>
      {reply.note ? <PreviewLine>Note: {reply.note}</PreviewLine> : null}
    </PreviewPanel>
  );
}

const PreviewPanel = styled.section`
  display: grid;
  gap: 10px;
  margin-top: 24px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;

  h2,
  p {
    margin: 0;
  }
`;

const PreviewLine = styled.p`
  border-radius: 6px;
  padding: 8px 10px;
  background: #f2f5f8;
  color: #243142;
  line-height: 1.45;
`;

export default CompanionReplyPreview;
