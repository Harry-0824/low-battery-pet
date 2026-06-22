import styled from "styled-components";

export const Button = styled.button<{ $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? "#111827" : "#d7dde6")};
  border-radius: 999px;
  padding: 9px 13px;
  background: ${({ $isSelected }) =>
    $isSelected ? "linear-gradient(180deg, #233348 0%, #111827 100%)" : "#ffffff"};
  color: ${({ $isSelected }) => ($isSelected ? "#ffffff" : "#243142")};
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
  box-shadow: ${({ $isSelected }) =>
    $isSelected
      ? "0 0 0 3px rgba(242, 140, 82, 0.24), inset 0 -2px 0 rgba(255, 255, 255, 0.12)"
      : "none"};

  &::before {
    content: "";
    display: ${({ $isSelected }) => ($isSelected ? "inline-block" : "none")};
    flex: 0 0 auto;
    width: 8px;
    height: 8px;
    border: 2px solid #fff7ed;
    border-radius: 999px;
    background: #f6c667;
    box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.26);
  }

  @media (max-width: 420px) {
    width: 100%;
    padding: 9px 8px;
  }

  &:focus-visible {
    outline: 3px solid rgba(242, 140, 82, 0.45);
    outline-offset: 3px;
  }
`;
