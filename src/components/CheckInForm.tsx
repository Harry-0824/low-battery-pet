import styled from "styled-components";

import type { ContextTag, MoodTag } from "../features/checkIn/checkInTypes";
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

const Form = styled.form`
  display: grid;
  gap: 22px;
`;

const Section = styled.section`
  display: grid;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 1rem;
  }
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const HelperText = styled.p`
  margin: 0;
  color: #8a4b21;
  font-size: 0.9rem;
  line-height: 1.45;
`;

const SubmitButton = styled.button`
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  padding: 12px 16px;
  background: #f28c52;
  color: #fff7ed;
  cursor: pointer;
  font: inherit;
  font-weight: 800;

  &:hover:not(:disabled) {
    background: #e5773f;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export default CheckInForm;
