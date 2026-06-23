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

/**
 * RetroDeviceFrame 元件
 *
 * 這是整個畫面的外框，外觀像一台復古遊戲機：
 * - DeviceShell：黃色機身，有質感陰影
 * - DeviceHeader：品牌名稱 + 狀態燈
 * - DeviceScreen：主要的內容顯示區域（可捲動）
 * - DeviceControls：裝飾用的十字鍵和圓形按鈕
 *
 * Props:
 * - isFeedbackActive: 送出表單後是否短暫套用回饋動畫（機身漣漪 + 狀態燈閃爍）
 */
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
      <DeviceScreen $isFeedbackActive={isFeedbackActive} data-testid="retro-device-screen">
        {children}
      </DeviceScreen>
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
