# Low Battery Pet

Low Battery Pet 是一個 local-first、行動優先的日常陪伴型 PWA。使用者可以在大約 10 秒內完成一次低壓 check-in，讓一隻小電量獸用溫和的回應、簡短行動和本機紀錄陪使用者撐過今天。

## Demo 重點

- 繁體中文、低壓、不評分的 check-in 流程
- 小電量獸會依照心情、電量與情境顯示不同狀態
- 回應包含一句陪伴話、一句寵物話和一個很小的行動
- 本機保存最近紀錄、陪伴天數與 7 天小電量足跡
- PWA shell 可安裝，並提供基本離線 app shell

## Demo 操作建議

1. 開啟首頁，先展示第一次使用引導與空的樹洞狀態。
2. 選一個今天的電量，再選一個卡住的地方。
3. 可選擇在樹洞留一句短短的話，或保持空白。
4. 送出後展示小電量獸狀態、陪伴回應與一件小事。
5. 重新整理頁面，確認本機紀錄仍保留。
6. 展示最近 7 天的小電量足跡與「放下這些紀錄」流程。

## 技術棧

- React
- Vite
- TypeScript
- styled-components
- Vitest
- Testing Library
- npm

## 本機開發

```bash
npm ci
npm run dev
```

## 驗證

```bash
npm test
npm run build
```

## 目前非目標

- 後端或 Supabase 整合
- AI API 整合
- 身分驗證或帳號系統
- 推播通知
- 社群、排行榜或成就系統
- 新增 UI 框架或狀態管理函式庫

## 儲存庫規則

- AI / 程式開發流程規則以 `AGENTS.md` 為準。
- 產品與架構方向以 `DESIGN.md` 為準。
- 變更需維持小範圍且以單一 Issue 為界。
