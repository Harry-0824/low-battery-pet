import type { ContextTag, MoodTag } from "../features/checkIn/checkInTypes";
import {
  ButtonGrid,
  Form,
  HelperText,
  MoodSpectrumGrid,
  Section,
  SubmitButton
} from "./CheckInForm.styles";
import TagButton from "./TagButton";

/**
 * CheckInForm 元件
 *
 * 這是使用者的主要輸入區：
 * - 心情選擇（單選）
 * - 情境標籤（複選）
 * - 送出按鈕
 *
 * 表單送出前會先檢查是否有選擇心情（心情為必填）。
 */
const moodOptions: Array<{
  value: MoodTag;
  label: string;
  icon: string;
  polarity: "positive" | "neutral" | "negative";
}> = [
  { value: "energized", label: "有電", icon: "⚡", polarity: "positive" },
  { value: "joyful", label: "雀躍", icon: "♪", polarity: "positive" },
  { value: "content", label: "平靜", icon: "☀", polarity: "positive" },
  { value: "okay", label: "還行", icon: "·", polarity: "neutral" },
  { value: "low_battery", label: "快沒電", icon: "▵", polarity: "negative" },
  { value: "annoyed", label: "很煩", icon: "!", polarity: "negative" },
  { value: "lonely", label: "有點孤單", icon: "○", polarity: "negative" },
  { value: "no_thoughts", label: "腦袋空白", icon: "…", polarity: "negative" }
];

const contextOptions: Array<{ value: ContextTag; label: string }> = [
  { value: "small_win", label: "做完一小件事" },
  { value: "rested_well", label: "有休息到" },
  { value: "connected", label: "有人陪一下" },
  { value: "wallet_pressure", label: "錢包有壓力" },
  { value: "work_stress", label: "工作太滿" },
  { value: "social_fatigue", label: "社交疲勞" },
  { value: "dinner_problem", label: "晚餐不知道" },
  { value: "want_to_rest", label: "想躺著" }
];

interface CheckInFormProps {
  selectedMoodTag: MoodTag | null;
  selectedContextTags: ContextTag[];
  isSubmitting: boolean;
  onMoodSelect: (moodTag: MoodTag) => void;
  onContextToggle: (contextTag: ContextTag) => void;
  onSubmit: () => void;
}

function CheckInForm({
  selectedMoodTag,
  selectedContextTags,
  isSubmitting,
  onMoodSelect,
  onContextToggle,
  onSubmit
}: CheckInFormProps) {
  const hasMoodSelection = selectedMoodTag !== null;
  const canSubmit = hasMoodSelection && !isSubmitting;
  const moodHelperId = "mood-helper";
  const helperText = isSubmitting
    ? "小電量獸正在收集今天的一點點。"
    : !hasMoodSelection
      ? "先選一個最像今天的電量"
      : null;

  return (
    <Form
      aria-label="今天的小電量紀錄"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) {
          onSubmit();
        }
      }}
    >
      <Section>
        <legend>今天的電量</legend>
        {helperText ? (
          <HelperText id={moodHelperId} aria-live={isSubmitting ? "polite" : undefined}>
            {helperText}
          </HelperText>
        ) : null}
        <MoodSpectrumGrid aria-label="情緒光譜">
          {moodOptions.map((option) => (
            <TagButton
              key={option.value}
              icon={option.icon}
              label={option.label}
              polarity={option.polarity}
              isSelected={selectedMoodTag === option.value}
              describedBy={helperText ? moodHelperId : undefined}
              onClick={() => onMoodSelect(option.value)}
            />
          ))}
        </MoodSpectrumGrid>
      </Section>

      <Section>
        <legend>今天卡住的地方</legend>
        <ButtonGrid>
          {contextOptions.map((option) => (
            <TagButton
              key={option.value}
              label={option.label}
              isSelected={selectedContextTags.includes(option.value)}
              onClick={() => onContextToggle(option.value)}
            />
          ))}
        </ButtonGrid>
      </Section>

      <SubmitButton
        type="submit"
        disabled={!canSubmit}
        aria-busy={isSubmitting}
        aria-describedby={helperText ? moodHelperId : undefined}
      >
        {isSubmitting ? "收集中..." : "讓小電量獸接住我"}
      </SubmitButton>
    </Form>
  );
}

export default CheckInForm;
