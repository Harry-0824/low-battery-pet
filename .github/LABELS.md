# Low Battery Pet Labels

This document defines the recommended GitHub label taxonomy for the
AI-assisted workflow in this repository.

Labels described here are documentation only. This file does not create labels
in GitHub, change automation, or update workflows.

## Label Categories

Low Battery Pet uses labels to describe issue type, AI ownership, and workflow
status.

Use lowercase labels with a category prefix:

- `type:*` describes the kind of issue.
- `agent:*` describes the AI or workflow owner.
- `status:*` describes the current workflow state.

## Type Labels

Type labels describe the kind of work being tracked.

| Label | Use |
| --- | --- |
| `type:parent` | A parent issue that groups related child issues or a small workflow batch. |
| `type:child` | A focused child issue that should produce one scoped implementation PR. |
| `type:chore` | Maintenance work that does not change product behavior. |
| `type:bug` | A defect or regression that should be fixed within the issue scope. |
| `type:feature` | A user-facing product capability or enhancement. |
| `type:documentation` | Documentation-only work. |

## Agent Labels

Agent labels describe the AI or workflow owner expected to handle the next
step.

| Label | Use |
| --- | --- |
| `agent:gpt` | ChatGPT should plan, write issues, clarify scope, or review PRs. |
| `agent:codex` | Codex should implement the assigned issue and open a PR. |
| `agent:hermes` | Hermes should handle Obsidian notes or workflow memory outside this repository. |

## Status Labels

Status labels describe where the issue or PR sits in the AI-assisted workflow.

| Label | Use |
| --- | --- |
| `status:ready-for-codex` | The issue is scoped and ready for Codex implementation. |
| `status:in-progress` | Implementation is underway on a dedicated branch. |
| `status:pr-opened` | A pull request has been opened for the issue. |
| `status:needs-review` | The pull request is waiting for review. |
| `status:approved` | The pull request has been reviewed and approved. |
| `status:blocked` | Work cannot continue without clarification or an external dependency. |
| `status:merged` | The pull request has been merged. |

Use one active workflow status label at a time whenever possible. Replace the
previous status label when the workflow advances.

## Workflow Mapping

The normal workflow state transition is:

```text
Issue Created
->
status:ready-for-codex
->
status:in-progress
->
status:pr-opened
->
status:needs-review
->
status:approved
->
status:merged
```

Use `status:blocked` when the normal flow cannot continue because the issue is
unclear, required information is missing, validation is blocked, or an external
review decision is needed.

## Usage Examples

### Parent Issue

Use these labels for a parent issue that defines a group of related child
issues:

```text
type:parent
agent:gpt
```

### Child Issue

Use these labels when a scoped child issue is ready for implementation:

```text
type:child
status:ready-for-codex
```

### PR Opened

Use this status when Codex has opened a pull request:

```text
status:pr-opened
```

### Waiting Review

Use this status when the pull request is waiting for review:

```text
status:needs-review
```

### Merged

Use this status after the pull request has been merged:

```text
status:merged
```

## Out of Scope

This document only defines the label taxonomy.

Do not use this documentation change to:

- Create labels in GitHub.
- Modify GitHub Actions workflows.
- Add workflow automation.
- Change source code.
- Change dependencies.
- Change `README.md`, `AGENTS.md`, or `.github/AI_WORKFLOW.md`.
