import { DrawerNote, Field, Label, TextArea, TextCounter, TextHeader } from "./TreeTextInput.styles";

/**
 * TreeTextInput 元件
 *
 * 一個多行文字輸入框，類比「樹洞」的概念：
 * - 上限 120 字
 * - 有即時字數計數器
 * - 有 helper text 提示使用者可以留空
 * - 有無障礙 label 和說明關聯
 *
 * Props:
 * - value: 當前輸入內容
 * - onChange: 內容變更時的回呼
 */
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
      <DrawerNote id={noteHelpId}>這裡可以很小聲。留一句、留半句，或先空著都可以。</DrawerNote>
      <TextArea
        aria-describedby={`${noteHelpId} ${noteCounterId}`}
        id="check-in-note"
        maxLength={120}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="把今天的一點點放進來。"
      />
    </Field>
  );
}

export default TreeTextInput;
