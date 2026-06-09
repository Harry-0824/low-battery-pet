import { Button } from "./TagButton.styles";

interface TagButtonProps {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}

function TagButton({ isSelected, label, onClick }: TagButtonProps) {
  return (
    <Button type="button" aria-pressed={isSelected} $isSelected={isSelected} onClick={onClick}>
      {label}
    </Button>
  );
}

export default TagButton;
