import type { PropsWithChildren } from "react";
import {
  Brand,
  DPad,
  DPadLine,
  DeviceControls,
  DeviceHeader,
  DeviceScreen,
  DeviceShell,
  RoundButton,
  StatusLight,
  StatusLights
} from "./RetroDeviceFrame.styles";

interface RetroDeviceFrameProps {
  isFeedbackActive?: boolean;
}

function RetroDeviceFrame({
  children,
  isFeedbackActive = false
}: PropsWithChildren<RetroDeviceFrameProps>) {
  return (
    <DeviceShell aria-label="小電量獸裝置" $isFeedbackActive={isFeedbackActive}>
      <DeviceHeader>
        <Brand>小電量獸</Brand>
        <StatusLights aria-hidden="true" $isFeedbackActive={isFeedbackActive}>
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

export default RetroDeviceFrame;
