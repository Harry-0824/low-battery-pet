import { useState } from "react";

import type { CompanionReply } from "../features/reply/replyTypes";
import {
  ActionButton,
  ActionStage,
  MicroBurst,
  PetLift,
  PreviewLine,
  PreviewPanel,
  ReplyGroup
} from "./CompanionReplyPreview.styles";

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
        <TinyActionInteraction key={`${reply.reply}|${reply.petLine}|${reply.tinyAction}`} />
      </ReplyGroup>
    </PreviewPanel>
  );
}

function TinyActionInteraction() {
  const [isActionDone, setIsActionDone] = useState(false);

  return (
    <ActionStage $isDone={isActionDone} data-action-state={isActionDone ? "done" : "idle"}>
      <PetLift aria-hidden="true">小電量獸</PetLift>
      {isActionDone ? (
        <MicroBurst aria-hidden="true" data-testid="tiny-action-burst">
          <span>♡</span>
          <span>＋</span>
          <span>✦</span>
        </MicroBurst>
      ) : null}
      <ActionButton type="button" disabled={isActionDone} onClick={() => setIsActionDone(true)}>
        {isActionDone ? "充了一小格電 ⚡" : "我做了！"}
      </ActionButton>
    </ActionStage>
  );
}

export default CompanionReplyPreview;
