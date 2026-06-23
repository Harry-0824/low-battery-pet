import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { registerServiceWorker } from "./registerServiceWorker";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

/**
 * main.tsx
 *
 * 應用程式的進入點（Entry Point）：
 * 1. 建立 React root 並渲染 App 元件
 * 2. 用 ThemeProvider 提供全域主題
 * 3. 注入 GlobalStyle 進行 CSS reset
 * 4. 註冊 Service Worker（PWA 離線支援）
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

registerServiceWorker();
