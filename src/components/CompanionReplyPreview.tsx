import type { CompanionReply } from "../features/reply/replyTypes";
import { PreviewLine, PreviewPanel, ReplyGroup } from "./CompanionReplyPreview.styles";

/**
 * CompanionReplyPreview 元件
 *
 * 渲染小電量獸給使用者的陪伴回覆，包含：
 * - 牠說：情緒共鳴的主要回覆 + 寵物的自言自語
 * - 一件小事：具體的行動建議
 */
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
