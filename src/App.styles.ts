import styled from "styled-components";

export const PageShell = styled.main`
  width: min(100%, 560px);
  margin: 0 auto;
  padding: 24px 14px 48px;

  [data-testid="follow-up-reminder"] {
    display: grid;
    gap: 10px;
    margin: -6px 0 20px;
    border: 1px solid #fed7aa;
    border-left: 4px solid #f28c52;
    border-radius: 8px;
    padding: 12px;
    background: #fff7ed;
    color: #7c2d12;
    box-shadow: 0 8px 18px rgba(242, 140, 82, 0.1);
  }

  [data-testid="follow-up-reminder"] p {
    margin: 0;
    font-weight: 800;
    line-height: 1.5;
  }

  [data-testid="follow-up-reminder"] div {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (max-width: 420px) {
    padding: 12px 8px 32px;

    [data-testid="follow-up-reminder"] {
      margin: -4px 0 16px;
      padding: 10px;
    }

    [data-testid="follow-up-reminder"] div {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

export const Header = styled.header`
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font-size: 3.25rem;
    line-height: 1;
  }

  p {
    margin: 0;
    color: #4b5563;
    font-weight: 700;
    line-height: 1.6;
  }

  @media (max-width: 420px) {
    margin-bottom: 18px;

    h1 {
      font-size: 2rem;
      line-height: 1.08;
    }

    p {
      line-height: 1.55;
    }
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
  overflow-wrap: anywhere;

  @media (max-width: 420px) {
    margin: -6px 0 16px;
    padding: 9px 10px;
  }
`;

export const FirstUseGuide = styled.section`
  display: grid;
  gap: 8px;
  margin: -8px 0 18px;
  border: 1px solid rgba(216, 181, 138, 0.72);
  border-radius: 8px;
  padding: 10px 12px;
  background: rgba(255, 253, 248, 0.76);
  color: #5f3216;

  h2 {
    margin: 0;
    font-size: 1rem;
  }

  ol {
    display: grid;
    gap: 6px;
    margin: 0;
    padding-left: 20px;
  }

  li {
    line-height: 1.5;
  }

  @media (max-width: 420px) {
    margin: -4px 0 16px;
    padding: 9px 10px;
  }
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
  overflow-wrap: anywhere;

  @media (max-width: 420px) {
    margin: -6px 0 16px;
    padding: 9px 10px;
  }
`;
