import styled from "styled-components";

export const Button = styled.button<{ $isSelected: boolean }>`
  min-height: 44px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#233348" : "#d7dde6")};
  border-radius: 999px;
  padding: 10px 14px;
  background: ${({ $isSelected }) => ($isSelected ? "#233348" : "#ffffff")};
  color: ${({ $isSelected }) => ($isSelected ? "#ffffff" : "#243142")};
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  line-height: 1.2;
`;