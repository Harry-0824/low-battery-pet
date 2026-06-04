import styled from "styled-components";

import type { ContextTag, DerivedUserState, MoodTag } from "../features/checkIn/checkInTypes";
import type { PetState } from "../features/pet/petTypes";

interface PreviewState {
  moodTag: MoodTag;
  contextTags: ContextTag[];
  derivedUserState: DerivedUserState;
  petState: PetState;
}

interface StatePreviewProps {
  previewState: PreviewState | null;
}

function StatePreview({ previewState }: StatePreviewProps) {
  if (!previewState) {
    return (
      <PreviewPanel aria-live="polite">
        <h2>State preview</h2>
        <p>Choose tags and preview the state output.</p>
      </PreviewPanel>
    );
  }

  return (
    <PreviewPanel aria-live="polite">
      <h2>State preview</h2>
      <PreviewGroup>
        <h3>Input</h3>
        <StateLine>Selected mood: {previewState.moodTag}</StateLine>
        <StateLine>
          Selected contexts:{" "}
          {previewState.contextTags.length > 0 ? previewState.contextTags.join(", ") : "none"}
        </StateLine>
      </PreviewGroup>
      <PreviewGroup>
        <h3>Derived user state</h3>
        {formatState(previewState.derivedUserState).map(([key, value]) => (
          <StateLine key={key}>
            {key}: {String(value)}
          </StateLine>
        ))}
      </PreviewGroup>
      <PreviewGroup>
        <h3>Pet state</h3>
        {formatState(previewState.petState).map(([key, value]) => (
          <StateLine key={key}>
            {key}: {String(value)}
          </StateLine>
        ))}
      </PreviewGroup>
    </PreviewPanel>
  );
}

const formatState = (state: object) => Object.entries(state);

const PreviewPanel = styled.section`
  display: grid;
  gap: 16px;
  margin-top: 24px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;

  h2,
  h3,
  p {
    margin: 0;
  }

  p {
    color: #5f6b7a;
  }
`;

const PreviewGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const StateLine = styled.p`
  border-radius: 6px;
  padding: 8px 10px;
  background: #f2f5f8;
  color: #243142;
  font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  font-size: 0.88rem;
  line-height: 1.45;
`;

export default StatePreview;
