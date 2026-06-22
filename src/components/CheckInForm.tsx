import type { ContextTag, MoodTag } from "../features/checkIn/checkInTypes";
import { ButtonGrid, Form, HelperText, Section, SubmitButton } from "./CheckInForm.styles";
import TagButton from "./TagButton";

const moodOptions: Array<{ value: MoodTag; label: string }> = [
  { value: "okay", label: "還行" },
  { value: "low_battery", label: "快沒電" },
  { value: "annoyed", label: "很煩" },
  { value: "lonely", label: "有點孤單" },
  { value: "no_thoughts", label: "腦袋空白" }
];

const contextOptions: Array<{ value: ContextTag; label: string }> = [
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
        <ButtonGrid>
          {moodOptions.map((option) => (
            <TagButton
              key={option.value}
              label={option.label}
              isSelected={selectedMoodTag === option.value}
              describedBy={helperText ? moodHelperId : undefined}
              onClick={() => onMoodSelect(option.value)}
            />
          ))}
        </ButtonGrid>
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
