import styled from "styled-components";

interface TreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

function TreeTextInput({ value, onChange }: TreeTextInputProps) {
  return (
    <Field>
      <Label htmlFor="check-in-note">想丟進樹洞的話</Label>
      <TextArea
        id="check-in-note"
        maxLength={120}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="可以只寫一句，或先空著。"
      />
    </Field>
  );
}

const Field = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 22px;
`;

const Label = styled.label`
  font-weight: 800;
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 12px 14px;
  background: #ffffff;
  color: #243142;
  font: inherit;
  line-height: 1.5;
  resize: vertical;
`;

export default TreeTextInput;
