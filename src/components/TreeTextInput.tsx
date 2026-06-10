import { DrawerNote, Field, Label, TextArea, TextCounter, TextHeader } from "./TreeTextInput.styles";

interface TreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

function TreeTextInput({ value, onChange }: TreeTextInputProps) {
  const noteHelpId = "check-in-note-help";
  const noteCounterId = "check-in-note-counter";

  return (
    <Field>
      <TextHeader>
        <Label htmlFor="check-in-note">想丟進樹洞的話</Label>
        <TextCounter id={noteCounterId} aria-live="polite">
          {value.length}/120
        </TextCounter>
      </TextHeader>
      <DrawerNote id={noteHelpId}>這裡可以很小聲。留一句、留半句，或先讓它空著都可以。</DrawerNote>
      <TextArea
        aria-describedby={`${noteHelpId} ${noteCounterId}`}
        id="check-in-note"
        maxLength={120}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="把今天卡住的一點點丟進來。"
      />
    </Field>
  );
}

export default TreeTextInput;
