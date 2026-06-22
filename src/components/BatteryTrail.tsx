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

const batteryTrailCopy = {
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
