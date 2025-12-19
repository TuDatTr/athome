# Contributing to athomev2

Thank you for your interest in contributing to **athomev2**! This project follows a Trunk-Based Development workflow with automated versioning.

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (latest version)
- [Docker](https://www.docker.com/) (for Keycloak and PostgreSQL testing)
- [Git](https://git-scm.com/)

### Local Development Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/TuDatTr/athome.git
   cd athome
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up infrastructure:**
   ```bash
   docker compose up -d
   ```

4. **Initialize the database:**
   ```bash
   bun run src/db/migrate.ts
   bun run src/db/seeds/initial_data.ts
   ```

5. **Start the development server:**
   ```bash
   bun run dev
   ```
   The application will be available at `http://localhost:3001`.

## Development Workflow

### Trunk-Based Development
- We use the `main` branch as our single source of truth.
- For small changes, you can commit directly to `main` (if you have permissions).
- For larger features or fixes, create a short-lived feature branch and open a Pull Request.

### Conventional Commits
We strictly use [Conventional Commits](https://www.conventionalcommits.org/) to automate our release process and changelog generation. Your commit messages must follow this format:

- `feat: ...` for new features (triggers a **Minor** release).
- `fix: ...` for bug fixes (triggers a **Patch** release).
- `chore: ...`, `docs: ...`, `style: ...`, `refactor: ...`, `perf: ...`, `test: ...` for other changes.
- `feat!: ...` or including `BREAKING CHANGE:` in the footer for breaking changes (triggers a **Major** release).

### Code Quality
Before submitting your changes, please run the following:

- **Typecheck:** `bunx tsc --noEmit`
- **Build CSS:** `bun run build:css` (to ensure Tailwind compiles correctly)

## Architecture Guidelines

- **HTMX First:** Prefer declarative HTMX attributes for interactivity over custom client-side JavaScript.
- **Async Database:** Use the unified `AsyncDatabaseAdapter` in `src/db/index.ts`. All queries and mutations must be `async`.
- **i18n:** Ensure all user-facing strings are added to the database translation tables (`profile_translations`, `experience_translations`, etc.).
- **CMS Security:** All routes under `/admin/*` must be protected by the OIDC middleware.

## Automated Releases
Once a PR is merged into `main`, the **Release Please** action will automatically:
1. Update the version in `package.json`.
2. Generate/update `CHANGELOG.md`.
3. Create a GitHub Release with version tags and attached Kubernetes manifests.
4. Trigger a Docker build and push to GitHub Container Registry (GHCR).
