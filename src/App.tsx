import { useState } from "react";

import { CompanionDaysNote, Header, PageShell } from "./App.styles";
import CheckInForm from "./components/CheckInForm";
import HistoryList from "./components/HistoryList";
import RetroDeviceFrame from "./components/RetroDeviceFrame";
import StatePreview from "./components/StatePreview";
import TreeTextInput from "./components/TreeTextInput";
import type { ContextTag, MoodTag } from "./features/checkIn/checkInTypes";
import { deriveUserState } from "./features/checkIn/deriveUserState";
import {
  clearCheckInHistory,
  getCompanionDayCount,
  loadCheckInHistory,
  saveCheckInRecord
} from "./features/history/historyStorage";
import type { CheckInHistoryRecord } from "./features/history/historyTypes";
import type { PetState } from "./features/pet/petTypes";
import { calculatePetState } from "./features/pet/petStateEngine";
import { generateCompanionReply } from "./features/reply/companionReplyEngine";
import type { CompanionReply } from "./features/reply/replyTypes";

interface PreviewState {
  petState: PetState;
  companionReply: CompanionReply;
}

function App() {
  const [selectedMoodTag, setSelectedMoodTag] = useState<MoodTag | null>(null);
  const [selectedContextTags, setSelectedContextTags] = useState<ContextTag[]>([]);
  const [shortText, setShortText] = useState("");
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const [historyRecords, setHistoryRecords] = useState<CheckInHistoryRecord[]>(() =>
    loadCheckInHistory()
  );
  const companionDayCount = getCompanionDayCount(historyRecords);
  const companionDaysMessage =
    companionDayCount > 0
      ? `小電量獸陪你 ${companionDayCount} 天了`
      : "小電量獸會從今天開始陪你。";

  const handleContextToggle = (contextTag: ContextTag) => {
    setSelectedContextTags((currentTags) =>
      currentTags.includes(contextTag)
        ? currentTags.filter((tag) => tag !== contextTag)
        : [...currentTags, contextTag]
    );
  };

  const handleSubmit = () => {
    if (!selectedMoodTag) {
      return;
    }

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
      petState,
      companionReply
    });

    setSelectedMoodTag(null);
    setSelectedContextTags([]);
    setShortText("");
  };

  const handleClearHistory = () => {
    clearCheckInHistory();
    setHistoryRecords([]);
  };

  return (
    <PageShell>
      <RetroDeviceFrame>
        <Header>
          <h1>今天電量如何？</h1>
          <p>選一下現在的狀態，讓小電量獸接住你。</p>
        </Header>
        <CompanionDaysNote data-testid="companion-days">{companionDaysMessage}</CompanionDaysNote>
        <TreeTextInput value={shortText} onChange={setShortText} />
        <CheckInForm
          selectedMoodTag={selectedMoodTag}
          selectedContextTags={selectedContextTags}
          onMoodSelect={setSelectedMoodTag}
          onContextToggle={handleContextToggle}
          onSubmit={handleSubmit}
        />
        <StatePreview previewState={previewState} />
        <HistoryList records={historyRecords} onClear={handleClearHistory} />
      </RetroDeviceFrame>
    </PageShell>
  );
}

export default App;
