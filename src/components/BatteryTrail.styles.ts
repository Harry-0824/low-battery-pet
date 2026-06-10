import styled from "styled-components";

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
  }
`;

export const TrailIntro = styled.p`
  margin: 0;
  color: #5f6b7a;
  line-height: 1.5;
`;

export const TrailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

export const DayPip = styled.div<{ $energyLevel: BatteryTrailEnergyLevel }>`
  min-height: 58px;
  border: 1px solid ${({ $energyLevel }) => trailColor[$energyLevel].border};
  border-radius: 8px;
  padding: 6px 4px;
  background: ${({ $energyLevel }) => trailColor[$energyLevel].background};
  color: ${({ $energyLevel }) => trailColor[$energyLevel].text};
  text-align: center;
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
