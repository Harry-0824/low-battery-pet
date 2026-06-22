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
