# VRChat Event Calendar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Linting](https://github.com/kurone-kito/vrc-event-calendar/actions/workflows/lint.yml/badge.svg)](https://github.com/kurone-kito/vrc-event-calendar/actions/workflows/lint.yml)
[![Built with IDD](https://img.shields.io/badge/Built%20with-IDD-0a7ea4)](https://github.com/kurone-kito/idd-skill/blob/main/docs/workshop/README.md)
[![CodeRabbit](https://img.shields.io/badge/review-CodeRabbit-green?logo=coderabbit)](https://www.coderabbit.ai/)

A workshop companion repository for building a VRChat Event Calendar
with Issue-Driven Development (IDD).

## Quick Start

1. Start the Docker services and development server:

   ```sh
   npm run dev:docker
   ```

2. Run database migrations:

   ```sh
   npm run db:migrate
   ```

3. Seed the database with sample events:

   ```sh
   npm run db:seed
   ```

### Available database scripts

| Script | Command | Description |
| --- | --- | --- |
| `db:migrate` | `prisma migrate dev` | Apply pending migrations |
| `db:seed` | `prisma db seed` | Insert sample events (idempotent) |
| `db:studio` | `prisma studio` | Open Prisma Studio GUI |
| `db:reset` | `prisma migrate reset --force` | Reset and re-apply all migrations |

## Built with idd-skill

This example repository is built alongside the
[Build a VRChat Event Calendar with IDD workshop](https://github.com/kurone-kito/idd-skill/blob/main/docs/workshop/README.md)
in `kurone-kito/idd-skill`. If you arrived here first, start with the
workshop to see the claims, plans, pull requests, and merge loops behind
the codebase.

## Features

- AI agent guidance with a Copilot-first compatibility layout
  ([GitHub Copilot canonical guide](.github/copilot-instructions.md),
  [OpenAI Codex adapter](AGENTS.md),
  [Claude Code adapter](CLAUDE.md),
  [Gemini CLI adapter](GEMINI.md),
  [strategy notes](docs/ai-strategy.md))
- CI/CD
  - [CodeRabbit](https://www.coderabbit.ai/)
  - [ImgBot](https://imgbot.net/)
  - Linting on GitHub Actions
  - Stale issues and pull requests management on GitHub Actions
- [Conventional Commits](https://www.conventionalcommits.org/)
- Documents for GitHub
- Git attributes
- Linters
  - [CSpell](https://cspell.org/)
  - [EditorConfig](https://editorconfig.org/)
  - [MarkdownLint](https://github.com/DavidAnson/markdownlint)

### Recommended NeoVim / Vim plugins

- [editorconfig-vim](https://github.com/editorconfig/editorconfig-vim) —
  EditorConfig support
- [cspell.nvim](https://github.com/davidmh/cspell.nvim) — CSpell
  integration for NeoVim (via null-ls / none-ls)

## Using this template

1. Click "Use this template" on GitHub to create your repository.
2. Replace the LICENSE file if you prefer a different license.
3. Review workflows under `.github/workflows` and adjust them to your needs.
4. Customize the configuration files:
   - `.editorconfig` sets editor rules.
   - `.gitattributes` manages line ending normalization and export rules.
   - `.imgbotconfig` controls image optimization.
   - `.markdownlint.yml` and `.markdownlint-cli2.yaml` define Markdown
     lint rules.
   - `.cspell.config.yml` configures spell checking.
   - `.coderabbit.yaml` contains CodeRabbit settings.
   - `.vscode/` provides recommended settings for VS Code.
5. Update documents in `.github/` such as CONTRIBUTING.md to match your
   policies.
6. Review `docs/ai-strategy.md`, then update `AGENTS.md`,
   `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` to
   reflect your project specifics and preferred tooling order.

## License

[MIT](./LICENSE)
