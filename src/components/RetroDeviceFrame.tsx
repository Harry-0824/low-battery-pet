import type { PropsWithChildren } from "react";
import styled from "styled-components";

function RetroDeviceFrame({ children }: PropsWithChildren) {
  return (
    <DeviceShell aria-label="小電量獸裝置">
      <DeviceHeader>
        <Brand>小電量獸</Brand>
        <StatusLights aria-hidden="true">
          <StatusLight />
          <StatusLight />
        </StatusLights>
      </DeviceHeader>
      <DeviceScreen data-testid="retro-device-screen">{children}</DeviceScreen>
      <DeviceControls aria-hidden="true">
        <DPad>
          <DPadLine />
          <DPadLine $vertical />
        </DPad>
        <RoundButton />
        <RoundButton />
      </DeviceControls>
    </DeviceShell>
  );
}

const DeviceShell = styled.div`
  width: min(100%, 480px);
  margin: 0 auto;
  border: 3px solid #243142;
  border-radius: 28px;
  padding: 18px;
  background: #f0d66f;
  box-shadow: 0 18px 0 #caa442, 0 24px 36px rgba(36, 49, 66, 0.22);
`;

const DeviceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const Brand = styled.p`
  margin: 0;
  color: #243142;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.08em;
`;

const StatusLights = styled.div`
  display: flex;
  gap: 7px;
`;

const StatusLight = styled.span`
  width: 11px;
  height: 11px;
  border: 2px solid #243142;
  border-radius: 999px;
  background: #7fb069;
`;

const DeviceScreen = styled.div`
  max-height: 72vh;
  overflow-y: auto;
  border: 3px solid #243142;
  border-radius: 14px;
  padding: 18px;
  background: #f8fafc;
`;

const DeviceControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 18px;
`;

const DPad = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
`;

const DPadLine = styled.span<{ $vertical?: boolean }>`
  position: absolute;
  inset: ${({ $vertical }) => ($vertical ? "4px 24px" : "24px 4px")};
  border-radius: 8px;
  background: #243142;
`;

const RoundButton = styled.span`
  width: 38px;
  height: 38px;
  border: 3px solid #243142;
  border-radius: 999px;
  background: #e76f51;
  box-shadow: inset 0 -5px 0 rgba(36, 49, 66, 0.18);
`;

export default RetroDeviceFrame;
