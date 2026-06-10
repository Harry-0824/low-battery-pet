# Low Battery Pet AI Workflow

This guide documents how AI-assisted work should be planned, implemented,
reviewed, merged, and handed off in this repository.

Low Battery Pet is a local-first portfolio PWA. AI tools may support the
workflow, but every change must stay issue-scoped, reviewable, and aligned with
the repository rules in `AGENTS.md`.

## Roles

- GitHub Issues are the task source of truth.
- `AGENTS.md` is the repository rule source.
- `DESIGN.md` is used only when the issue affects UI, layout, architecture,
  component boundaries, data flow, or user flow.
- ChatGPT may create issues, clarify scope, and review pull requests.
- Codex implements one assigned GitHub Issue at a time.
- GitHub Pull Requests are the review and handoff unit.
- GitHub Actions provide automated validation signals.
- Hermes handles Obsidian notes and workflow memory outside this repository.

## Planning

Before implementation starts:

1. Read the assigned GitHub Issue.
2. Read `AGENTS.md`.
3. Read `DESIGN.md` only when the issue makes it relevant.
4. Identify the smallest safe change that satisfies the issue.
5. Start from the issue's suggested files when provided.
6. Confirm out-of-scope areas before editing.

Do not infer the active task from branch history, recent commits, closed issues,
or local files. If no issue is assigned, stop and ask for the target issue.

## Implementation

Codex should:

- Create one dedicated branch for the current issue.
- Modify only files required by the issue.
- Preserve local-first behavior unless the issue explicitly says otherwise.
- Keep Traditional Chinese product copy when product copy is in scope.
- Avoid unrelated refactors, dependency changes, build changes, config changes,
  or workflow changes.
- Never commit secrets, local config, credentials, `.env`, or `.env.local`.

For documentation-only issues, keep the diff limited to the requested
documentation file or files. Do not run broad product checks unless the issue
asks for them or the documentation change affects executable behavior.

## Review

Every pull request should make the scope easy to verify:

- Link the related issue.
- Summarize the change.
- List changed files.
- Explain how the change was validated.
- State risks and out-of-scope items.
- Confirm no unrelated files, secrets, local config, or unnecessary
  dependencies were added.

Review should compare the pull request against the issue, not against imagined
future work. If the pull request exceeds the issue scope, it should be revised
before merge.

## GitHub Actions

GitHub Actions are validation signals, not permission to expand scope.

- Passing checks support merge readiness.
- Failing checks must be investigated only when related to the current issue.
- Unrelated failures should be reported honestly instead of fixed inside the
  current pull request.
- Workflow files should not be changed unless the issue explicitly requires it.

## Merge

Do not merge a pull request unless the user explicitly asks after review.

Before merge, confirm:

- The pull request is not a draft.
- The pull request matches the related issue.
- The changed files are within scope.
- Validation is reported honestly.
- No secrets, local config, dependencies, source code, UI, styles, build config,
  test config, issue templates, PR template, or GitHub Actions workflows were
  changed unless explicitly required by the issue.

After merge, stop unless the user explicitly requests cleanup or follow-up work.

## Handoff

After opening a pull request, Codex should report:

- Summary
- Changed files
- Validation result, or why validation was not run
- Scope check
- Risks
- Follow-up
- Pull request link

Hermes owns Obsidian handoff notes. Codex must not modify Obsidian, Notion, or
planning documents unless the user explicitly scopes that work.
