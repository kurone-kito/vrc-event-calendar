# IDD Policy Configuration

This repository imports the IDD workflow from
`kurone-kito/idd-skill` and uses the following local policy choices.

## Merge Policy

**Policy**: `fully_autonomous_merge`

This repository is maintained as a solo workshop example. Protected PR
flow and required CI checks remain enabled, but self-approval is not
required because GitHub does not allow approving your own pull requests.

## PR Review Policy

**Profile**: `copilot-advisory`

Copilot advisory review remains enabled as a non-blocking signal.
Agents should still complete a thorough C-phase self-review before PR
submission.

## Review-Thread Resolution Policy

**Policy**: `fast-agent-resolve`

## Critique-Loop Profile

**Profile**: distributed defaults

## Claim Timing

- **claim-stale-age**: `PT24H`
- **claim-heartbeat-interval**: `PT12H`

## CI Wait Policy

- **running timeout**: `PT30M`
- **generation timeout**: `PT10M`
- **rerun policy**: `rerun-once`

## Credential Scope

- **Worker credentials**: repository write access for issue, PR, and
  branch operations within this repository
- **Merge-capable credentials**: same credential set as worker sessions
  because `fully_autonomous_merge` is enabled for this protected solo
  repository

## Issue Start Approval

- **issue-author approval gate**: enabled by default
- **maintainer approval actors**: `owners-and-maintainers-only`

Because the issue author is also the repository owner, owner-authored
issues are self-authorizing under the default policy.

## Helper Runtime

**Profile**: `instructions-only`

The repository has not yet bootstrapped its application toolchain, so
IDD sessions should follow the Markdown instructions directly instead of
assuming package-manager or Node-based helper execution.

## Command Rows

The current onboarding baseline keeps `install-deps`, `fix-validate`,
`pre-push-validate`, and `post-fix-validate` as `true` until the actual
application toolchain lands. Future stack-bootstrap work should update
those command rows alongside the new package scripts.

## Trusted Marker Actors

- `kurone-kito`
