import { useState } from "react";
import styled from "styled-components";

import CheckInForm from "./components/CheckInForm";
import CompanionReplyPreview from "./components/CompanionReplyPreview";
import HistoryList from "./components/HistoryList";
import StatePreview from "./components/StatePreview";
import TreeTextInput from "./components/TreeTextInput";
import type { ContextTag, DerivedUserState, MoodTag } from "./features/checkIn/checkInTypes";
import { deriveUserState } from "./features/checkIn/deriveUserState";
import {
  clearCheckInHistory,
  loadCheckInHistory,
  saveCheckInRecord
} from "./features/history/historyStorage";
import type { CheckInHistoryRecord } from "./features/history/historyTypes";
import type { PetState } from "./features/pet/petTypes";
import { calculatePetState } from "./features/pet/petStateEngine";
import { generateCompanionReply } from "./features/reply/companionReplyEngine";
import type { CompanionReply } from "./features/reply/replyTypes";

interface PreviewState {
  moodTag: MoodTag;
  contextTags: ContextTag[];
  derivedUserState: DerivedUserState;
  petState: PetState;
  companionReply: CompanionReply;
}

function App() {
  const [selectedMoodTag, setSelectedMoodTag] = useState<MoodTag>("okay");
  const [selectedContextTags, setSelectedContextTags] = useState<ContextTag[]>([]);
  const [shortText, setShortText] = useState("");
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const [historyRecords, setHistoryRecords] = useState<CheckInHistoryRecord[]>(() =>
    loadCheckInHistory()
  );

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
      contextTags: selectedContextTags,
      shortText
    };
    const derivedUserState = deriveUserState(input);
    const petState = calculatePetState(derivedUserState);
    const companionReply = generateCompanionReply(input);
    const createdAt = new Date().toISOString();

    const records = saveCheckInRecord({
      moodTag: input.moodTag,
      contextTags: input.contextTags,
      shortText: input.shortText,
      derivedUserState,
      petState,
      companionReply,
      createdAt
    });
    setHistoryRecords(records);

    setPreviewState({
      ...input,
      derivedUserState,
      petState,
      companionReply
    });
  };

  const handleClearHistory = () => {
    clearCheckInHistory();
    setHistoryRecords([]);
  };

  return (
    <PageShell>
      <Header>
        <h1>Low Battery Pet</h1>
        <p>選一個現在的狀態，預覽小寵物會怎麼反應。</p>
      </Header>
      <TreeTextInput value={shortText} onChange={setShortText} />
      <CheckInForm
        selectedMoodTag={selectedMoodTag}
        selectedContextTags={selectedContextTags}
        onMoodSelect={setSelectedMoodTag}
        onContextToggle={handleContextToggle}
        onSubmit={handleSubmit}
      />
      <StatePreview previewState={previewState} />
      <CompanionReplyPreview reply={previewState?.companionReply ?? null} />
      <HistoryList records={historyRecords} onClear={handleClearHistory} />
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
