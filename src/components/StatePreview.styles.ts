import styled from "styled-components";

export const PreviewPanel = styled.section`
  display: grid;
  gap: 14px;
  margin-top: 24px;
  animation: preview-rise-in 420ms ease-out;

  @keyframes preview-rise-in {
    from {
      opacity: 0;
      transform: translateY(14px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
