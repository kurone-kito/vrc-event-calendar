# Guidelines for AI Agents

This repository hosts the `vrc-event-calendar` workshop example
application. It imports the IDD workflow from
`kurone-kito/idd-skill` and keeps `AGENTS.md` as a direct Codex entry
point.

## Immediate rules

- Match the conversational language to the user's language.
- Write comments and documentation in English unless there is a clear
  project-specific reason otherwise.
- If uncertainty, hidden risk, or missing context blocks a safe change,
  stop and ask a concise question before proceeding.
- Keep changes small and reviewable. If you create commits, follow the
  project's Conventional Commits rules and keep each commit atomic.
- Do not modify community documents (`CODE_OF_CONDUCT*`,
  `CONTRIBUTING*`) without explicit approval.

## Project standards

- **Indentation**: 2 spaces
- **Line endings**: LF only
- **Trailing whitespace**: trimmed except in Markdown
- **Final newline**: always present
- **File naming**: lowercase with hyphens unless a platform convention
  requires otherwise

## Commit rules

This project follows
[Conventional Commits](https://www.conventionalcommits.org/).
A `.gitmessage` template is available at the repository root.
Write user-facing, lowercase subjects, keep them under 72 characters,
and split unrelated changes into separate atomic commits.

## Branch strategy

This project follows GitHub Flow. All changes reach `main` through
pull requests (merge commits only — squash and rebase merge are
disabled). Feature branches are always rebased onto `main`, never
merged. See the full rules in
[.github/copilot-instructions.md](.github/copilot-instructions.md#branch-strategy).

## IDD Workflow

This project uses Issue-Driven Development (IDD) with parallel AI
agents. Start with [docs/idd-workflow.md](docs/idd-workflow.md) for the
cross-agent entry path and phase routing.

Before starting IDD work, open
`.github/instructions/idd-overview.instructions.md`. Open the routed
phase file manually when the current step changes.

## IDD Policy

Repository-local IDD choices are recorded in
[docs/idd-policy.md](docs/idd-policy.md). Read that file before
assuming helper runtime, claim timing, approval, or merge behavior.

## Canonical reference

The full, Copilot-first project guidance lives in
[.github/copilot-instructions.md](.github/copilot-instructions.md).
When that file uses Copilot-specific workflow names, apply the intent
in Codex using Codex's own interaction model rather than following the
product terms literally.
