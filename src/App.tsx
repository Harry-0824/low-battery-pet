import { useState } from "react";
import styled from "styled-components";

import CheckInForm from "./components/CheckInForm";
import StatePreview from "./components/StatePreview";
import type { ContextTag, DerivedUserState, MoodTag } from "./features/checkIn/checkInTypes";
import { deriveUserState } from "./features/checkIn/deriveUserState";
import type { PetState } from "./features/pet/petTypes";
import { calculatePetState } from "./features/pet/petStateEngine";

interface PreviewState {
  moodTag: MoodTag;
  contextTags: ContextTag[];
  derivedUserState: DerivedUserState;
  petState: PetState;
}

function App() {
  const [selectedMoodTag, setSelectedMoodTag] = useState<MoodTag>("okay");
  const [selectedContextTags, setSelectedContextTags] = useState<ContextTag[]>([]);
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);

  const handleContextToggle = (contextTag: ContextTag) => {
    setSelectedContextTags((currentTags) =>
      currentTags.includes(contextTag)
        ? currentTags.filter((tag) => tag !== contextTag)
        : [...currentTags, contextTag]
    );
  };

  const handleSubmit = () => {
    const input = {
      moodTag: selectedMoodTag,
      contextTags: selectedContextTags
    };
    const derivedUserState = deriveUserState(input);
    const petState = calculatePetState(derivedUserState);

    setPreviewState({
      ...input,
      derivedUserState,
      petState
    });
  };

  return (
    <PageShell>
      <Header>
        <h1>Low Battery Pet</h1>
        <p>選一個現在的狀態，預覽小寵物會怎麼反應。</p>
      </Header>
      <CheckInForm
        selectedMoodTag={selectedMoodTag}
        selectedContextTags={selectedContextTags}
        onMoodSelect={setSelectedMoodTag}
        onContextToggle={handleContextToggle}
        onSubmit={handleSubmit}
      />
      <StatePreview previewState={previewState} />
    </PageShell>
  );
}

const PageShell = styled.main`
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 32px 18px 48px;
`;

const Header = styled.header`
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(2rem, 8vw, 3.25rem);
    line-height: 1;
  }

  p {
    margin: 0;
    color: #5f6b7a;
    line-height: 1.6;
  }
`;

export default App;
