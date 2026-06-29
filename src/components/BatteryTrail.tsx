import type { BatteryTrailDay, BatteryTrailEnergyLevel } from "../features/history/historyStorage";
import {
  DayLabel,
  DayPip,
  DayStatus,
  TrailEmptyNote,
  TrailGrid,
  TrailIntro,
  TrailSection
} from "./BatteryTrail.styles";

/**
 * 電池足跡的文字與圖示對照表
 *
 * 依能量等級顯示不同顏色和標語的空氣品質圖樣式元件。
 */
const batteryTrailCopy = {
  full: {
    label: "有電",
    title: "今天小電量獸有亮一點"
  },
  critical: {
    label: "快沒電",
    title: "那天很低電量"
  },
  low: {
    label: "低電量",
    title: "那天有點低電量"
  },
  normal: {
    label: "有一點亮",
    title: "那天有一點亮"
  },
  empty: {
    label: "慢慢來",
    title: "那天沒有留下紀錄，也可以慢慢來"
  }
} satisfies Record<BatteryTrailEnergyLevel, { label: string; title: string }>;

interface BatteryTrailProps {
  days: BatteryTrailDay[];
}

/**
 * BatteryTrail 元件
 *
 * 顯示最近 7 天的小電量足跡，用 7 個小方格表示每一天：
 * - 有紀錄的日子會亮起並顯示能量等級
 * - 沒有紀錄的日子顯示灰暗的「慢慢來」
 * - 若 7 天全都是空的，則顯示鼓勵訊息而非格子
 */
function BatteryTrail({ days }: BatteryTrailProps) {
  const isEmptyTrail = days.every((day) => day.energyLevel === "empty");

  return (
    <TrailSection aria-label="最近 7 天的小電量足跡" data-testid="battery-trail">
      <h2>最近 7 天的小電量足跡</h2>
      {isEmptyTrail ? (
        <TrailEmptyNote>7 天後這裡會慢慢亮起來，今天先留一點點就好。</TrailEmptyNote>
      ) : (
        <>
          <TrailIntro>有紀錄的日子會亮一下，空白也可以慢慢來。</TrailIntro>
          <TrailGrid>
            {days.map((day) => {
              const copy = batteryTrailCopy[day.energyLevel];

              return (
                <DayPip
                  key={day.dateKey}
                  $energyLevel={day.energyLevel}
                  data-testid="battery-trail-day"
                  title={copy.title}
                >
                  <DayLabel>{day.label}</DayLabel>
                  <DayStatus>{copy.label}</DayStatus>
                </DayPip>
              );
            })}
          </TrailGrid>
        </>
      )}
    </TrailSection>
  );
}

export default BatteryTrail;
