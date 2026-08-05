# Task Tracker (demo monorepo)

A small, fictive Task Tracker web app used as the **Day 3 hands-on template repo** for the GitHub Actions workshop.
It's a Node.js/Express backend + React frontend npm-workspaces monorepo, intentionally simple, so the
focus stays on the GitHub/Actions features it demonstrates rather than the app itself.

> This repo is meant to be marked as a **GitHub template repository** (Settings &rarr; check "Template repository"). Each participant creates their own copy from it - never work directly in this repo.

## Getting your own copy

1. On GitHub, click **Use this template** &rarr; **Create a new repository** and pick your own account/namespace.
   (CLI alternative: `gh repo create my-demo-repo --template spindev/demo-repo --private --clone`)
2. Continue with [Hands-On Lab 01](#hands-on-labs) below.

## Hands-On Labs

| # | Lab |
|---|-----|
| 01 | [Repo Setup & Branch Protection](hol/01-Repo-Setup-and-Branch-Protection.md) (own copy, CODEOWNERS, ruleset, auto-merge, auto-delete branches) |
| 02 | [Build Container Images in Parallel](hol/02-Parallel-Docker-Builds.md) (matrix the `docker` job so backend/frontend images build as separate parallel jobs) |
| 03 (optional) | [GHAS and Grouped Dependabot Updates](hol/03-GHAS-and-Dependabot.md) (Dependabot alerts, secret scanning + push protection, grouped updates per ecosystem) |

## Structure

```
backend/    Express API (in-memory data), tests via node:test + supertest, Dockerfile
frontend/   React app (Vite), tests via vitest + Testing Library, Dockerfile (nginx)
.github/    CI and CodeQL/dependency review workflows (CODEOWNERS added as part of hol/01)
hol/        Day 3 hands-on labs
```

## What this repo showcases

- **npm workspaces monorepo** with independent lint/test/build per package
- **`act`**: run the `ci` workflow locally with Docker (see below)
- **CI workflow** ([.github/workflows/ci.yml](.github/workflows/ci.yml)): lint, test and build both packages, then build both Dockerfiles
- **Dependency review** ([.github/workflows/dependency-review.yml](.github/workflows/dependency-review.yml)): flags newly introduced vulnerable/high-severity dependencies on pull requests
- **Code scanning** ([.github/workflows/codeql.yml](.github/workflows/codeql.yml)): CodeQL analysis for JavaScript/TypeScript
- Ready to be wired up to branch protection rulesets, CODEOWNERS, auto-merge, merge queue, etc. (see `hol/`)

## Local development

```bash
# install all workspace dependencies
npm install

# run everything
npm run lint
npm run test
npm run build

# run a single workspace
npm run test --workspace backend
npm run dev --workspace frontend
```

The backend listens on `http://localhost:3001`, the frontend dev server proxies `/api` to it.

## Run with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3001

## Run the CI workflow locally with act

```bash
act push -W .github/workflows/ci.yml
```

> The `docker` job builds container images inside the workflow - make sure Docker is running before invoking act.
