import { useEffect, useRef, useState } from "react";

import {
  CompanionDaysNote,
  FirstUseGuide,
  Header,
  PageShell,
  PetMemoryNote
} from "./App.styles";
import BatteryTrail from "./components/BatteryTrail";
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
  getPetStateMemoryMessage,
  getRecentBatteryTrail,
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
  const [previewAnimationKey, setPreviewAnimationKey] = useState(0);
  const [isSubmitFeedbackActive, setIsSubmitFeedbackActive] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<CheckInHistoryRecord[]>(() =>
    loadCheckInHistory()
  );
  const [historyWasCleared, setHistoryWasCleared] = useState(false);
  const submitFeedbackTimeoutRef = useRef<number | null>(null);
  const companionDayCount = getCompanionDayCount(historyRecords);
  const companionDaysMessage =
    companionDayCount > 0
      ? `小電量獸陪你 ${companionDayCount} 天了`
      : "小電量獸今天先在旁邊待機，等你想靠近再開始。";
  const batteryTrailDays = getRecentBatteryTrail(historyRecords);
  const petMemoryMessage = getPetStateMemoryMessage(historyRecords);
  const emptyHistoryKind = historyWasCleared ? "cleared" : "first-use";
  const shouldShowFirstUseGuide = historyRecords.length === 0 && !historyWasCleared;

  useEffect(() => {
    return () => {
      if (submitFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(submitFeedbackTimeoutRef.current);
      }
    };
  }, []);

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

    if (submitFeedbackTimeoutRef.current !== null) {
      window.clearTimeout(submitFeedbackTimeoutRef.current);
    }
    setIsSubmitFeedbackActive(true);

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
    setHistoryWasCleared(false);

    setPreviewState({
      petState,
      companionReply
    });
    setPreviewAnimationKey((currentKey) => currentKey + 1);

    setSelectedMoodTag(null);
    setSelectedContextTags([]);
    setShortText("");

    submitFeedbackTimeoutRef.current = window.setTimeout(() => {
      setIsSubmitFeedbackActive(false);
      submitFeedbackTimeoutRef.current = null;
    }, 650);
  };

  const handleClearHistory = () => {
    clearCheckInHistory();
    setHistoryRecords([]);
    setHistoryWasCleared(true);
  };

  return (
    <PageShell>
      <RetroDeviceFrame isFeedbackActive={isSubmitFeedbackActive}>
        <Header>
          <h1>今天電量如何？</h1>
          <p>選一個最像現在的電量，讓小電量獸接住你。</p>
        </Header>
        <CompanionDaysNote data-testid="companion-days">{companionDaysMessage}</CompanionDaysNote>
        {shouldShowFirstUseGuide ? (
          <FirstUseGuide aria-labelledby="first-use-guide-title">
            <h2 id="first-use-guide-title">第一次靠近小電量獸</h2>
            <ol>
              <li>先選一個最像今天的電量。</li>
              <li>有卡住的地方可以點一下，也可以把樹洞留空。</li>
              <li>送出後，牠會留一句話和一個很小的行動。</li>
            </ol>
          </FirstUseGuide>
        ) : null}
        {petMemoryMessage ? (
          <PetMemoryNote data-testid="pet-state-memory">{petMemoryMessage}</PetMemoryNote>
        ) : null}
        <BatteryTrail days={batteryTrailDays} />
        <TreeTextInput value={shortText} onChange={setShortText} />
        <CheckInForm
          selectedMoodTag={selectedMoodTag}
          selectedContextTags={selectedContextTags}
          isSubmitting={isSubmitFeedbackActive}
          onMoodSelect={setSelectedMoodTag}
          onContextToggle={handleContextToggle}
          onSubmit={handleSubmit}
        />
        <StatePreview key={previewAnimationKey} previewState={previewState} />
        <HistoryList
          records={historyRecords}
          emptyStateKind={emptyHistoryKind}
          onClear={handleClearHistory}
        />
      </RetroDeviceFrame>
    </PageShell>
  );
}

export default App;
