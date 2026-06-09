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
  { value: "wallet_pressure", label: "錢包壓力" },
  { value: "work_stress", label: "工作爆炸" },
  { value: "social_fatigue", label: "社交疲勞" },
  { value: "dinner_problem", label: "晚餐選擇" },
  { value: "want_to_rest", label: "想躺著" }
];

interface CheckInFormProps {
  selectedMoodTag: MoodTag | null;
  selectedContextTags: ContextTag[];
  onMoodSelect: (moodTag: MoodTag) => void;
  onContextToggle: (contextTag: ContextTag) => void;
  onSubmit: () => void;
}

function CheckInForm({
  selectedMoodTag,
  selectedContextTags,
  onMoodSelect,
  onContextToggle,
  onSubmit
}: CheckInFormProps) {
  const canSubmit = selectedMoodTag !== null;

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) {
          onSubmit();
        }
      }}
    >
      <Section>
        <h2>今天的電量</h2>
        {!canSubmit ? <HelperText>先選一個今天的電量</HelperText> : null}
        <ButtonGrid>
          {moodOptions.map((option) => (
            <TagButton
              key={option.value}
              label={option.label}
              isSelected={selectedMoodTag === option.value}
              onClick={() => onMoodSelect(option.value)}
            />
          ))}
        </ButtonGrid>
      </Section>

      <Section>
        <h2>今天卡住的事</h2>
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

      <SubmitButton type="submit" disabled={!canSubmit}>
        讓小電量獸接住我
      </SubmitButton>
    </Form>
  );
}

export default CheckInForm;
