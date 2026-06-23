/**
 * theme.ts
 *
 * styled-components 的主題定義
 * 目前只包含顏色設定，供全局 ThemeProvider 使用
 */

export const theme = {
  colors: {
    background: "#dbe7c9",
    device: "#f0d66f",
    deviceShadow: "#caa442",
    text: "#1f2937"
  }
} as const;
