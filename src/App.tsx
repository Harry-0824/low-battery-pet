/**
 * 小電量獸主應用程式元件
 *
 * 這是整個應用的核心，負責串接表單輸入、狀態推導、寵物狀態計算、
 * 陪伴回覆生成，以及 localStorage 中的歷史紀錄管理。
 *
 * 使用者流程：
 * 1. 選擇今天的心情（Mood Tag）和卡住的 context tags
 * 2. 可選擇性留下短文字（樹洞）
 * 3. 送出後，系統會推導使用者的內在狀態、計算寵物狀態、
 *    生成陪伴回覆，並儲存到 localStorage
 * 4. 使用者可以在下方的歷史列表中查看過往紀錄，
 *    也會根據最近 7 天的紀錄顯示電池足跡圖
 */

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
import TagButton from "./components/TagButton";
import TreeTextInput from "./components/TreeTextInput";
import type { ContextTag, MoodTag } from "./features/checkIn/checkInTypes";
import { deriveUserState } from "./features/checkIn/deriveUserState";
import {
  FOLLOW_UP_OPTIONS,
  getPendingFollowUpRecord,
  loadFollowUpResponses,
  saveFollowUpResponse
} from "./features/history/followUpReminder";
import {
  clearCheckInHistory,
  deleteCheckInHistoryDay,
  getCompanionDayCount,
  getPetStateMemoryMessage,
  getRecentBatteryTrail,
  loadCheckInHistory,
  saveCheckInRecord
} from "./features/history/historyStorage";
import type { CheckInHistoryRecord, FollowUpOption } from "./features/history/historyTypes";
import type { PetState } from "./features/pet/petTypes";
import { calculatePetState } from "./features/pet/petStateEngine";
import { generateCompanionReply } from "./features/reply/companionReplyEngine";
import type { CompanionReply } from "./features/reply/replyTypes";

interface PreviewState {
  petState: PetState;
  companionReply: CompanionReply;
}

/**
 * 送出後，按鈕短暫顯示「收集中...」的持續時間（毫秒）
 * 這段時間按鈕會保持 disabled 狀態，給使用者一個有被接收到的感觉
 */
const SUBMIT_FEEDBACK_DURATION_MS = 900;

function App() {
  /** 使用者當前選中的心情標籤（單選） */
  const [selectedMoodTag, setSelectedMoodTag] = useState<MoodTag | null>(null);
  /** 使用者當前選中的情境標籤（可複選） */
  const [selectedContextTags, setSelectedContextTags] = useState<ContextTag[]>([]);
  /** 使用者輸入的短文字內容 */
  const [shortText, setShortText] = useState("");
  /** 送出後要顯示的寵物狀態與陪伴回覆（預覽區內容） */
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  /** 強制 StatePreview 重新渲染的 key，用於觸發動畫 */
  const [previewAnimationKey, setPreviewAnimationKey] = useState(0);
  /** 送出後的短暫反馈狀態，控制按鈕文字與 disabled 狀態 */
  const [isSubmitFeedbackActive, setIsSubmitFeedbackActive] = useState(false);
  /** 從 localStorage 載入的所有歷史紀錄（最新在前） */
  const [historyRecords, setHistoryRecords] = useState<CheckInHistoryRecord[]>(() =>
    loadCheckInHistory()
  );
  /** 使用者對後續追問的回應記錄 */
  const [followUpResponses, setFollowUpResponses] = useState(() => loadFollowUpResponses());
  /** 歷史紀錄是否被使用者手動清除過，用來切換不同的 empty state */
  const [historyWasCleared, setHistoryWasCleared] = useState(false);
  /** 送出後 feedback timer 的 ref，用來在 cleanup 時清除 */
  const submitFeedbackTimeoutRef = useRef<number | null>(null);
  /** 預覽區 DOM 元素的 ref，用於自動捲動 */
  const previewResultRef = useRef<HTMLDivElement | null>(null);
  /** 標記是否需要將預覽區捲動到可視範圍 */
  const shouldScrollToPreviewRef = useRef(false);

  /** 計算使用者與小電量獸相伴的天數（依據不同日期的紀錄數量） */
  const companionDayCount = getCompanionDayCount(historyRecords);
  /** 顯示在畫面上方的陪伴天數訊息 */
  const companionDaysMessage =
    companionDayCount > 0
      ? `小電量獸陪你 ${companionDayCount} 天了`
      : "小電量獸今天先在旁邊待機，等你想靠近再開始。";
  /** 最近 7 天的電池足跡資料（用於 BatteryTrail 元件渲染） */
  const batteryTrailDays = getRecentBatteryTrail(historyRecords);
  /** 根據近期歷史記憶生成的寵物備忘訊息 */
  const petMemoryMessage = getPetStateMemoryMessage(historyRecords);
  /** 歷史列表的 empty state 種類：第一次使用 or 手動清除後 */
  const emptyHistoryKind = historyWasCleared ? "cleared" : "first-use";
  /** 是否顯示首次使用引導文字（有紀錄後自動隱藏） */
  const shouldShowFirstUseGuide = historyRecords.length === 0 && !historyWasCleared;
  /**
   * 找出一條「待追問」的歷史紀錄：
   * - 必須是最近的一筆紀錄
   * - 使用者尚未回答過後續追問
   * - 該筆紀錄的時間落在 6~12 小時的追問時間窗內
   */
  const pendingFollowUpRecord = getPendingFollowUpRecord(
    historyRecords,
    followUpResponses.map((response) => response.recordCreatedAt)
  );

  /**
   * 元件 unmount 時的清理效果：
   * 確保送出後啟動的 timeout 不會在元件銷毀後繼續執行，
   * 避免在已卸載的元件上呼叫 setIsSubmitFeedbackActive 導致 memory leak。
   */
  useEffect(() => {
    return () => {
      if (submitFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(submitFeedbackTimeoutRef.current);
      }
    };
  }, []);

  /**
   * 當預覽區內容更新時，若 shouldScrollToPreviewRef 為 true，
   * 則自動將預覽區捲動到畫面上方，方便使用者看到回覆結果。
   * 同時尊重使用者的 prefers-reduced-motion 設定。
   */
  useEffect(() => {
    if (!previewState || !shouldScrollToPreviewRef.current || !previewResultRef.current) {
      return;
    }

    shouldScrollToPreviewRef.current = false;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    previewResultRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }, [previewAnimationKey, previewState]);

  /**
   * 切換情境標籤的選取狀態：
   * - 若已經選中，則取消選取（filter 掉）
   * - 若未選中，則加入陣列
   */
  const handleContextToggle = (contextTag: ContextTag) => {
    setSelectedContextTags((currentTags) =>
      currentTags.includes(contextTag)
        ? currentTags.filter((tag) => tag !== contextTag)
        : [...currentTags, contextTag]
    );
  };

  /**
   * 處理表單送出：
   * 1. 確認使用者已選擇心情（心情為必填）
   * 2. 清除任何之前的 submit feedback timer
   * 3. 設定 isSubmitFeedbackActive 為 true，觸發按鈕短暫變化
   * 4. 呼叫 deriveUserState 將心情/情境轉為使用者的內在狀態
   * 5. 呼叫 calculatePetState 根據內在狀態計算寵物表現
   * 6. 呼叫 generateCompanionReply 生成陪伴回覆
   * 7. 將完整資料寫入 localStorage
   * 8. 更新預覽區內容並設定動畫 key
   * 9. 清空表單輸入，讓使用者可以進行下一次 check-in
   * 10. 設定 900ms 後的 timeout，恢復按鈕狀態
   */
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
    shouldScrollToPreviewRef.current = true;
    setPreviewAnimationKey((currentKey) => currentKey + 1);

    setSelectedMoodTag(null);
    setSelectedContextTags([]);
    setShortText("");

    submitFeedbackTimeoutRef.current = window.setTimeout(() => {
      setIsSubmitFeedbackActive(false);
      submitFeedbackTimeoutRef.current = null;
    }, SUBMIT_FEEDBACK_DURATION_MS);
  };

  /**
   * 清除所有歷史紀錄：
   * 1. 呼叫 historyStorage 的 clearCheckInHistory 移除 localStorage 中的資料
   * 2. 清空 React state，畫面會切換到 cleared empty state
   */
  const handleClearHistory = () => {
    clearCheckInHistory();
    setHistoryRecords([]);
    setHistoryWasCleared(true);
  };

  /**
   * 刪除指定日期的所有歷史紀錄：
   * 使用者點擊歷史卡片上的「...」按鈕，確認後只刪除該天，
   * 保留其他日期的紀錄。
   * 刪除後會同步更新 companion days 和 battery trail 的顯示。
   */
  const handleDeleteHistoryDay = (createdAt: string) => {
    const records = deleteCheckInHistoryDay(createdAt);
    setHistoryRecords(records);
    setHistoryWasCleared(records.length === 0);
  };

  /**
   * 處理後續追問的回應：
   * 使用者點擊 follow-up reminder 中的某個選項後，
   * 將回應寫入 localStorage，避免重複追問同一筆紀錄。
   */
  const handleFollowUpSelect = (option: FollowUpOption) => {
    if (!pendingFollowUpRecord) {
      return;
    }

    setFollowUpResponses(saveFollowUpResponse(pendingFollowUpRecord.createdAt, option));
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
        {pendingFollowUpRecord ? (
          <section aria-labelledby="follow-up-reminder-title" data-testid="follow-up-reminder">
            <p id="follow-up-reminder-title">小電量獸小聲問：剛剛那段時間，現在怎麼樣？</p>
            <div>
              {FOLLOW_UP_OPTIONS.map((option) => (
                <TagButton
                  key={option}
                  describedBy="follow-up-reminder-title"
                  isSelected={false}
                  label={option}
                  onClick={() => handleFollowUpSelect(option)}
                />
              ))}
            </div>
          </section>
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
        <StatePreview
          key={previewAnimationKey}
          ref={previewResultRef}
          previewState={previewState}
        />
        <HistoryList
          records={historyRecords}
          emptyStateKind={emptyHistoryKind}
          onClear={handleClearHistory}
          onDeleteDay={handleDeleteHistoryDay}
        />
      </RetroDeviceFrame>
    </PageShell>
  );
}

export default App;
