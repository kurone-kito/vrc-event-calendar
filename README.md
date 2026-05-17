# VRChat Event Calendar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/kurone-kito/vrc-event-calendar/actions/workflows/ci.yml/badge.svg)](https://github.com/kurone-kito/vrc-event-calendar/actions/workflows/ci.yml)
[![Built with IDD](https://img.shields.io/badge/Built%20with-IDD-0a7ea4)](https://github.com/kurone-kito/idd-skill/blob/main/docs/workshop/README.md)
[![CodeRabbit](https://img.shields.io/badge/review-CodeRabbit-green?logo=coderabbit)](https://www.coderabbit.ai/)

A VRChat event listing web app built as a companion project for the
[Build a VRChat Event Calendar with IDD workshop][workshop].

[workshop]: https://github.com/kurone-kito/idd-skill/blob/main/docs/workshop/README.md

## Prerequisites

- **[Docker Desktop][docker-desktop]** — runs the PostgreSQL database
- **[Node.js 22+][nodejs]** — runs the Next.js dev server
- **[gh CLI][gh-cli]** — for cloning and GitHub operations

[docker-desktop]: https://www.docker.com/products/docker-desktop/
[gh-cli]: https://cli.github.com/
[nodejs]: https://nodejs.org/

## Quick Start

```sh
gh repo clone kurone-kito/vrc-event-calendar
cd vrc-event-calendar
cp .env.example .env
```

Open `.env` and replace `@db:` with `@127.0.0.1:` in the `DATABASE_URL`
line so that host-side commands can reach the published PostgreSQL port:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/vrc_event_calendar?schema=public
```

Then start the database, install dependencies, and run the app:

```sh
docker compose up -d db
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open <http://localhost:3000> — you should see a list of seeded VRChat events.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run dev:docker` | Start Docker services and the dev server together |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server (requires `build` first) |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing files |
| `npm run db:migrate` | Apply pending Prisma migrations |
| `npm run db:seed` | Insert sample events (idempotent) |
| `npm run db:studio` | Open Prisma Studio in the browser |
| `npm run db:reset` | Reset and re-apply all migrations |

## Built with idd-skill

This repository is the example app built during the
[Build a VRChat Event Calendar with IDD workshop][workshop].
The workshop walks through every issue, branch, pull request, and merge
loop — start there if you want to see the development process behind the
codebase.

## License

[MIT](./LICENSE)
