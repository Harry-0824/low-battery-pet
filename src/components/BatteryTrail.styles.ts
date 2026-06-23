import styled from "styled-components";

/**
 * BatteryTrail.styles.ts
 *
 * 7 天電池足跡圖的樣式：
 * - TrailSection / TrailIntro / TrailEmptyNote: 區塊容器和說明文字
 * - TrailGrid: 7 天格子的網格，手機版改為 4 欄
 * - DayPip: 每天的小方塊，根據能量等級顯示不同顏色
 * - DayLabel / DayStatus: 日期和狀態文字
 */

import type { BatteryTrailEnergyLevel } from "../features/history/historyStorage";

const trailColor = {
  critical: {
    border: "#fca5a5",
    background: "#fee2e2",
    text: "#991b1b"
  },
  low: {
    border: "#fed7aa",
    background: "#fff7ed",
    text: "#9a3412"
  },
  normal: {
    border: "#bbf7d0",
    background: "#f0fdf4",
    text: "#166534"
  },
  empty: {
    border: "#d7dde6",
    background: "#f8fafc",
    text: "#5f6b7a"
  }
} satisfies Record<BatteryTrailEnergyLevel, { border: string; background: string; text: string }>;

export const TrailSection = styled.section`
  display: grid;
  gap: 10px;
  margin: 0 0 22px;

  h2 {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.3;
  }

  @media (max-width: 420px) {
    gap: 8px;
    margin-bottom: 18px;
  }
`;

export const TrailIntro = styled.p`
  margin: 0;
  color: #5f6b7a;
  line-height: 1.5;
`;

export const TrailEmptyNote = styled.p`
  margin: 0;
  border: 1px dashed #d7dde6;
  border-radius: 8px;
  padding: 9px 11px;
  background: rgba(248, 250, 252, 0.72);
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const TrailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;

  @media (max-width: 420px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }
`;

export const DayPip = styled.div<{ $energyLevel: BatteryTrailEnergyLevel }>`
  min-height: 58px;
  border: 1px solid ${({ $energyLevel }) => trailColor[$energyLevel].border};
  border-radius: 8px;
  padding: 6px 4px;
  background: ${({ $energyLevel }) => trailColor[$energyLevel].background};
  color: ${({ $energyLevel }) => trailColor[$energyLevel].text};
  text-align: center;
  overflow-wrap: anywhere;

  @media (max-width: 420px) {
    min-height: 54px;
    padding: 7px 5px;
  }
`;

export const DayLabel = styled.span`
  display: block;
  font-size: 0.72rem;
  font-weight: 800;
`;

export const DayStatus = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 0.72rem;
  line-height: 1.25;
`;
