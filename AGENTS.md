# AGENTS.md

此文件定義本儲存庫中 AI 程式代理的工作規則。

## Project Role

Low Battery Pet 是一個 local-first、日常陪伴型 PWA。

產品方向：

- 一般使用者可用，不是工程 demo。
- 每天 10 秒完成低壓 check-in。
- 一隻小電量獸陪使用者撐過今天。
- 語氣要像低電量但努力陪伴的寵物，不像 AI 助手、心理諮商師、生產力工具或勵志語錄產生器。

## Agent Role

- 針對目前指派的 GitHub Issue，實作小範圍、聚焦、可審查的變更。
- Codex 是 implementation worker，不是 PM、release manager、repo coordinator 或文件整理 agent。
- 預設流程是：實作目前 Issue → 驗證 → 開 PR → 回報 → 停止。

## 優先順序

1. 使用者在本次對話中的明確指示
2. 目前的 GitHub Issue
3. 本文件 `AGENTS.md`
4. `DESIGN.md`（相關時）
5. 儲存庫既有模式

若規則衝突，停止並回報，不要猜測。

## 工作流程規則

- 編碼前先閱讀指派的 Issue。
- 從 Issue 的 Suggested Files 開始。
- 保持最小 diff，且不超出範圍。
- 不修改無關檔案。
- 不掃描整個 repo，優先使用 targeted search。
- 若範圍不清楚、Issue 太大或缺少目標，先停止並提問。
- 一個 Issue = 一個聚焦變更 = 一個 branch = 一個 PR。
- PR 開好並回報後停止，不要自行繼續下一張 Issue。

## Branch / PR Rules

- 每個 Issue 使用獨立分支。
- 建議分支命名：
  - `feature/issue-<number>-short-name`
  - `fix/issue-<number>-short-name`
  - `docs/issue-<number>-short-name`
  - `test/issue-<number>-short-name`
  - `refactor/issue-<number>-short-name`
- PR body 需包含：
  - Summary
  - Related Issue
  - Changed Files
  - How to Test
  - Risk
  - Out of Scope
  - Scope Check
- 不要自行 merge PR，除非使用者在外部 review 後明確要求。

## Parallel Work Rules

平行任務只在使用者明確要求時允許。

平行執行時：

- 每個 Issue 必須有獨立 branch。
- 使用 separate worktrees、sandbox 或等效隔離。
- 每個 Issue 只能產生一個 PR。
- 不可把多個 Issues 合成一個 PR。
- 任務必須從最新 main 開始，除非使用者另有指示。
- 回報 changed files、validation、PR link、file overlap/conflict risk。
- 開完 PR 後停止，不要 merge，也不要繼續下一批。

## 範圍與安全護欄

- 除非 Issue 明確要求，禁止進行大規模重構。
- 不修改 unrelated files。
- 不修 unrelated lint/test/build 錯誤。
- 不可提交 secrets、keys、tokens、credentials、`.env`、`.env.local` 或本機設定。
- 除非 Issue 明確要求，禁止新增依賴。
- 除非 Issue 明確要求，禁止修改 `package.json` 或 lockfile。
- 除非 Issue 明確要求，禁止新增後端、認證、資料庫、AI API、部署、推播、社群、帳號系統。
- 除非 Issue 明確要求，禁止新增 UI 框架或狀態管理函式庫。
- 使用 npm。

## Low Battery Pet Product Guardrails

除非 Issue 明確要求，不要實作：

- Supabase
- backend
- auth/account
- AI API
- push notification
- leaderboard/social features
- full achievement system
- complex pet growth system
- complex calendar system

優先維持：

- local-first
- 短流程
- 繁體中文 UI
- 低壓陪伴感
- 小範圍可驗收變更

## 文件規則

- 除非 Issue 明確要求，禁止建立額外 markdown 檔案。
- 除非 Issue 明確要求，不要修改 `README.md`、`AGENTS.md`、`DESIGN.md` 或 docs。
- 不碰 Obsidian 或 Notion。
- 若為文件基線任務，只能修改 Issue 明列的檔案。

## DESIGN.md 規則

只在 Issue 影響以下內容時閱讀相關段落：

- UI
- layout
- visual direction
- architecture
- page structure
- component boundaries
- data flow
- user flow

若 `DESIGN.md` 與 Issue 衝突，停止並回報。

## 測試與驗證規則

- 優先執行 Issue Test Plan 指定的檢查。
- 使用與變更相符的最小安全驗證。
- 小 UI / copy / style 變更不需要不必要的廣泛檢查，除非 Issue 要求。
- core logic、state flow、data transformation、validation、routing 變更需跑相關 tests/build。
- 只修目前 Issue 導致的失敗。
- 若同一驗證指令失敗兩次，停止並回報：
  - command
  - error
  - files changed
  - likely cause
  - recommended next step
- 不隱藏 failed validation。

## AI 使用護欄

- 不可默默擴大範圍。
- 不自行決定下一批功能。
- 不自行建立新 Issue。
- 不自行 merge。
- 不把流程雜事當成實作任務。
- Codex quota 應用於 implementation 與 issue-caused debugging，不用於 routine housekeeping。
