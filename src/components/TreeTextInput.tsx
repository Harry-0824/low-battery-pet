import { Field, Label, TextArea } from "./TreeTextInput.styles";

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

export default TreeTextInput;
