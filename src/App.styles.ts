import styled from "styled-components";

export const PageShell = styled.main`
  width: min(100%, 560px);
  margin: 0 auto;
  padding: 24px 14px 48px;
`;

export const Header = styled.header`
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(2rem, 8vw, 3.25rem);
    line-height: 1;
  }

  p {
    margin: 0;
    color: #5f6b7a;
    line-height: 1.6;
  }
`;

export const CompanionDaysNote = styled.p`
  margin: -10px 0 22px;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff7ed;
  color: #7c2d12;
  font-weight: 800;
  line-height: 1.5;
`;

export const PetMemoryNote = styled.p`
  margin: -10px 0 22px;
  border: 1px solid #d8b58a;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff8ed;
  color: #7c4a24;
  font-weight: 800;
  line-height: 1.5;
`;
