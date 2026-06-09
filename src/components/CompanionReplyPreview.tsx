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
    <PreviewPanel>
      <ReplyGroup>
        <h2>牠說</h2>
        <PreviewLine>{reply.reply}</PreviewLine>
        <PreviewLine>{reply.petLine}</PreviewLine>
      </ReplyGroup>
      <ReplyGroup>
        <h2>一件小事</h2>
        <PreviewLine>{reply.tinyAction}</PreviewLine>
      </ReplyGroup>
    </PreviewPanel>
  );
}

const PreviewPanel = styled.section`
  display: grid;
  gap: 14px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
`;

const ReplyGroup = styled.div`
  display: grid;
  gap: 8px;

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
