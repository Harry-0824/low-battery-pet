import styled, { css, keyframes } from "styled-components";

const shellRipple = keyframes`
  0% {
    opacity: 0.5;
    transform: scale(0.98);
  }

  70% {
    opacity: 0.18;
  }

  100% {
    opacity: 0;
    transform: scale(1.04);
  }
`;

const lightPulse = keyframes`
  0% {
    background: #7fb069;
    box-shadow: 0 0 0 rgba(127, 176, 105, 0);
  }

  35% {
    background: #f6c667;
    box-shadow: 0 0 14px rgba(246, 198, 103, 0.85);
  }

  100% {
    background: #7fb069;
    box-shadow: 0 0 0 rgba(127, 176, 105, 0);
  }
`;

export const DeviceShell = styled.div<{ $isFeedbackActive?: boolean }>`
  position: relative;
  isolation: isolate;
  width: min(100%, 480px);
  margin: 0 auto;
  border: 3px solid #243142;
  border-radius: 28px;
  padding: 18px;
  background: #f0d66f;
  box-shadow: 0 18px 0 #caa442, 0 24px 36px rgba(36, 49, 66, 0.22);

  &::after {
    content: "";
    position: absolute;
    inset: 10px;
    z-index: 0;
    border: 2px solid rgba(36, 49, 66, 0.28);
    border-radius: 24px;
    opacity: 0;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  ${({ $isFeedbackActive }) =>
    $isFeedbackActive
      ? css`
          &::after {
            animation: ${shellRipple} 650ms ease-out;
          }
        `
      : null}

  @media (max-width: 420px) {
    border-width: 2px;
    border-radius: 20px;
    padding: 10px;
    box-shadow: 0 10px 0 #caa442, 0 16px 24px rgba(36, 49, 66, 0.18);
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

export const DeviceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 420px) {
    margin-bottom: 10px;
  }
`;

export const Brand = styled.p`
  margin: 0;
  color: #243142;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.08em;
`;

export const StatusLight = styled.span`
  width: 11px;
  height: 11px;
  border: 2px solid #243142;
  border-radius: 999px;
  background: #7fb069;
`;

export const StatusLights = styled.div<{ $isFeedbackActive?: boolean }>`
  display: flex;
  gap: 7px;

  ${({ $isFeedbackActive }) =>
    $isFeedbackActive
      ? css`
          ${StatusLight} {
            animation: ${lightPulse} 650ms ease-out;
          }

          ${StatusLight}:nth-child(2) {
            animation-delay: 90ms;
          }
        `
      : null}

  @media (prefers-reduced-motion: reduce) {
    ${StatusLight} {
      animation: none;
    }
  }
`;

export const DeviceScreen = styled.div`
  max-height: 72vh;
  overflow-y: auto;
  border: 3px solid #243142;
  border-radius: 14px;
  padding: 18px;
  background: #f8fafc;

  @media (max-width: 420px) {
    max-height: 76vh;
    border-width: 2px;
    border-radius: 12px;
    padding: 12px;
  }
`;

export const DeviceControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 18px;
  cursor: default;
  pointer-events: none;
  user-select: none;

  @media (max-width: 420px) {
    margin-top: 12px;
  }
`;

export const DPad = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  cursor: default;

  @media (max-width: 420px) {
    width: 52px;
    height: 52px;
  }
`;

export const DPadLine = styled.span<{ $vertical?: boolean }>`
  position: absolute;
  inset: ${({ $vertical }) => ($vertical ? "4px 24px" : "24px 4px")};
  border-radius: 8px;
  background: #243142;
  cursor: default;

  @media (max-width: 420px) {
    inset: ${({ $vertical }) => ($vertical ? "4px 20px" : "20px 4px")};
  }
`;

export const RoundButton = styled.span`
  width: 38px;
  height: 38px;
  border: 3px solid #243142;
  border-radius: 999px;
  background: #e76f51;
  box-shadow: inset 0 -5px 0 rgba(36, 49, 66, 0.18);
  cursor: default;

  @media (max-width: 420px) {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
`;
