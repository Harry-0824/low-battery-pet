import type { CompanionReply } from "../features/reply/replyTypes";
import { PreviewLine, PreviewPanel, ReplyGroup } from "./CompanionReplyPreview.styles";

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

export default CompanionReplyPreview;
