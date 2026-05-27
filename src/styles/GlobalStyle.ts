import { createGlobalStyle } from "styled-components";

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
    background: #f7f8fb;
    color: #1f2937;
  }
`;
