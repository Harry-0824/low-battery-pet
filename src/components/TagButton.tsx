import { Button } from "./TagButton.styles";

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
