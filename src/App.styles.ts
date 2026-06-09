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