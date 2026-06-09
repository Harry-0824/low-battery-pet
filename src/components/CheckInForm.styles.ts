import styled from "styled-components";

export const Form = styled.form`
  display: grid;
  gap: 22px;
`;

export const Section = styled.section`
  display: grid;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 1rem;
  }
`;

export const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const HelperText = styled.p`
  margin: 0;
  color: #8a4b21;
  font-size: 0.9rem;
  line-height: 1.45;
`;

export const SubmitButton = styled.button`
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