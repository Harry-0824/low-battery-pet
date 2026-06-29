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

import type { BatteryTrailPolarity } from "../features/history/historyView";

const trailColor = {
  pos: {
    border: "#f4c95d",
    background: "#fff5c4",
    text: "#7c4a03"
  },
  calm: {
    border: "#e7d39a",
    background: "#fffaf0",
    text: "#67512f"
  },
  low: {
    border: "#b8c4cf",
    background: "#f1f5f9",
    text: "#425466"
  },
  crit: {
    border: "#9aa7b4",
    background: "#e8edf2",
    text: "#334155"
  },
  empty: {
    border: "#d7dde6",
    background: "#f8fafc",
    text: "#5f6b7a"
  }
} satisfies Record<BatteryTrailPolarity, { border: string; background: string; text: string }>;

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

export const DayPip = styled.div<{ $polarity: BatteryTrailPolarity }>`
  min-height: 58px;
  border: 1px solid ${({ $polarity }) => trailColor[$polarity].border};
  border-radius: 8px;
  padding: 6px 4px;
  background: ${({ $polarity }) => trailColor[$polarity].background};
  color: ${({ $polarity }) => trailColor[$polarity].text};
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
