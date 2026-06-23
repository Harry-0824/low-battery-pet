import { createGlobalStyle } from "styled-components";

/**
 * GlobalStyle.ts
 *
 * 全域 CSS 重置與基礎樣式：
 * - box-sizing: border-box
 * - html/body/#root 的最小高度設定
 * - body 的字體、背景色和文字顏色
 */

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    min-height: 100%;
  }

  body {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: #dbe7c9;
    color: #1f2937;
  }
`;
