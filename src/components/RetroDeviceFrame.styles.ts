import styled from "styled-components";

export const DeviceShell = styled.div`
  width: min(100%, 480px);
  margin: 0 auto;
  border: 3px solid #243142;
  border-radius: 28px;
  padding: 18px;
  background: #f0d66f;
  box-shadow: 0 18px 0 #caa442, 0 24px 36px rgba(36, 49, 66, 0.22);

  @media (max-width: 420px) {
    border-width: 2px;
    border-radius: 20px;
    padding: 10px;
    box-shadow: 0 10px 0 #caa442, 0 16px 24px rgba(36, 49, 66, 0.18);
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

export const StatusLights = styled.div`
  display: flex;
  gap: 7px;
`;

export const StatusLight = styled.span`
  width: 11px;
  height: 11px;
  border: 2px solid #243142;
  border-radius: 999px;
  background: #7fb069;
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

  @media (max-width: 420px) {
    margin-top: 12px;
  }
`;

export const DPad = styled.div`
  position: relative;
  width: 64px;
  height: 64px;

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

  @media (max-width: 420px) {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
`;
