import { Button } from "./TagButton.styles";

/**
 * TagButton 元件
 *
 * 一個看起來像膠囊按鈕的互斥/多選按鈕。
 * 用於心情選擇（單選）和情境標籤（複選）。
 *
 * Props:
 * - describedBy: 對應 helper text 的 id，提供無障礙說明
 * - isSelected: 是否被選中，影響樣式和 aria-pressed
 * - label: 按鈕顯示文字
 * - onClick: 點擊回呼
 */
interface TagButtonProps {
  describedBy?: string;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}

function TagButton({ describedBy, isSelected, label, onClick }: TagButtonProps) {
  return (
    <Button
      type="button"
      aria-describedby={describedBy}
      aria-pressed={isSelected}
      $isSelected={isSelected}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export default TagButton;
