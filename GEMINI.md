# GEMINI.md - Project Context for athomev2

## Project Overview
**athomev2** is a high-performance, multi-language (English/German) CV and Portfolio website with an integrated CMS. It is built using a modern, lightweight stack focused on server-side rendering and minimal client-side JavaScript.

## Core Technology Stack
- **Runtime:** [Bun](https://bun.sh/)
- **Web Framework:** [Hono](https://hono.dev/) (JSX for templating)
- **Interactivity:** [HTMX](https://htmx.org/) for declarative, partial page updates.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with native dark mode support.
- **Database:** Unified Async Adapter supporting both **SQLite** (local) and **PostgreSQL** (production).
- **Authentication:** [Keycloak](https://www.keycloak.org/) OIDC via the [Arctic](https://arctic.lucia-auth.com/) library.
- **Deployment:** Docker (multi-stage) and Kubernetes.

## Key Features
- **Internationalization (i18n):** Full support for English and German content, persisted via cookies.
- **Admin CMS:** Secure `/admin` dashboard for managing Profile, Experience, Education, Skills, Publications, and Projects.
- **Automated Versioning:** Trunk Based Development with [Release Please](https://github.com/googleapis/release-please) for automated SemVer and changelogs.
- **CI/CD:** GitHub Actions pipeline for linting, type-checking, Docker builds (GHCR), and Kubernetes asset management.

## Project Structure
- `src/index.tsx`: Main application, route handlers, and middleware.
- `src/db/`: 
  - `index.ts`: Unified Database Adapter (SQLite/Postgres).
  - `queries.ts` & `mutations.ts`: Clean separation of data access.
  - `migrate.ts`: Cross-database migration runner.
- `src/layouts/`: `BaseLayout.tsx` providing the HTMX/Tailwind skeleton.
- `src/components/`: Reusable CMS UI components.
- `src/lib/auth.ts`: Keycloak OIDC configuration.
- `k8s/`: Kubernetes deployment and secret manifests.
- `keycloak/`: Realm import configuration for local development.

## Development Workflows
### Conventional Commits
We strictly follow [Conventional Commits](https://www.conventionalcommits.org/). This is required for automated versioning:
- `feat:` -> Bumps Minor (e.g., 1.0.0 to 1.1.0)
- `fix:` -> Bumps Patch (e.g., 1.1.0 to 1.1.1)
- `feat!:` or `chore!:` -> Bumps Major (e.g., 1.1.1 to 2.0.0)

### Commands
- **Dev Server:** `bun run dev` (Runs on port 3001).
- **Build CSS:** `bun run build:css`.
- **Infrastructure:** `docker compose up -d` (Starts Keycloak).
- **Seed Data:** `bun run src/db/seeds/initial_data.ts`.
- **Typecheck:** `bunx tsc --noEmit`.

## Deployment
The project is containerized using a multi-stage `Dockerfile`. 
- **Production DB:** Set `DB_TYPE=postgres` and provide `DATABASE_URL`.
- **Kubernetes:** Manifests are located in `k8s/` and are automatically attached to GitHub Releases.