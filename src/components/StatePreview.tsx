import { forwardRef } from "react";

import type { PetState } from "../features/pet/petTypes";
import type { CompanionReply } from "../features/reply/replyTypes";
import CompanionReplyPreview from "./CompanionReplyPreview";
import PetDisplay from "./PetDisplay";
import { PreviewPanel } from "./StatePreview.styles";

interface PreviewState {
  petState: PetState;
  companionReply: CompanionReply;
}

interface StatePreviewProps {
  previewState: PreviewState | null;
}

/**
 * StatePreview 元件
 *
 * 這是使用者送出表單後出現的結果面板，包含：
 * - PetDisplay：寵物的視覺狀態
 * - CompanionReplyPreview：陪伴回覆內容
 *
 * 使用 forwardRef 讓父元件可以透過 ref 控制捲動行為。
 */
const StatePreview = forwardRef<HTMLElement, StatePreviewProps>(function StatePreview(
  { previewState },
  ref
) {
  if (!previewState) {
    return null;
  }

  return (
    <PreviewPanel ref={ref} aria-live="polite" data-testid="check-in-result">
      <PetDisplay petState={previewState.petState} />
      <CompanionReplyPreview reply={previewState.companionReply} />
    </PreviewPanel>
  );
});

export default StatePreview;
