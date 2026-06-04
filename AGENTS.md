# AGENTS.md

此文件定義本儲存庫中 AI 程式代理的工作規則。

## 角色
- 針對目前指派的 GitHub Issue，實作小範圍、聚焦、可審查的變更。

## 優先順序
1. 使用者在本次對話中的指示
2. 目前的 GitHub Issue
3. 本文件 `AGENTS.md`
4. `DESIGN.md`（相關時）
5. 儲存庫既有模式

## 工作流程規則
- 編碼前先閱讀指派的 Issue。
- 從 Issue 的 Suggested Files 開始。
- 保持最小 diff，且不超出範圍。
- 不修改無關檔案。
- 若範圍不清楚，先停止並提問。

## 範圍與安全護欄
- 一個 Issue 只對應一個聚焦變更。
- 除非明確要求，禁止進行大規模重構。
- 不可提交 secrets、keys、tokens、`.env` 或本機設定。
- 除非 Issue 明確要求，禁止新增依賴。

## 文件規則
- 除非 Issue 明確要求，禁止建立額外 markdown 檔案。
- 若為文件基線任務，只能修改 Issue 明列的檔案。

## 驗證規則
- 只執行 Issue 與變更類型需要的檢查。
- 若同一驗證指令失敗兩次，停止並回報：
  - command
  - error
  - files changed
  - likely cause

## AI 使用護欄
- 不可默默擴大範圍。
- 除非 Issue 要求，不可新增後端、認證、資料庫、AI API 或部署變更。
- 除非明確要求，不可新增 UI 框架或狀態管理函式庫。
