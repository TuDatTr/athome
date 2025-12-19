# GEMINI.md - Project Context for athomev2

## Directory Overview
This directory contains the initial planning and requirements for **athomev2**, a multi-language (English and German) CV and Portfolio website. The project is currently in its early stages, primarily consisting of documentation that defines the future implementation.

## Key Files
- `requirements.md`: The primary source of truth for the project's scope. It details functional requirements (CV display, CMS, i18n), non-functional requirements (performance, security), and the technical stack.
- `GEMINI.md`: This file, providing high-level context and guidance for future AI-driven interactions within this repository.

## Planned Technology Stack
Based on `requirements.md`, the project will utilize:
- **Language/Runtime:** TypeScript (implied by migration file naming and `tsconfig.json` requirement).
- **Templating & Interactivity:** **HTMX** for dynamic content and a smooth user experience without full page reloads.
- **Styling:** **TailwindCSS** with dark mode support and custom animations.
- **Database:** **SQLite** using a "Translation Table" pattern to handle multi-language content (English and German).
- **Authentication:** **Keycloak** as the OIDC Identity Provider, utilizing the **Arctic** library for the OIDC client.
- **Deployment/DevOps:** **Docker** for running services like Keycloak.

## Intended Project Structure
The implementation is expected to follow this structure:
- `src/components/`: Reusable HTML/HTMX components.
- `src/db/`: Database schema, migrations (`queries.ts` for reads, `mutations.ts` for writes).
- `src/routes/`: Route handlers for both public and administrative interfaces.
- `src/index.tsx`: Main application entry point.
- `tests/`: Project test suite.

## Development Conventions
- **Separation of Concerns:** Keep database read (`queries.ts`) and write (`mutations.ts`) operations separate.
- **HTMX-First:** Use HTMX for interactive elements and partial page updates.
- **Internationalization:** All content should support translations via the database pattern defined in requirements.
- **Security:** Protect `/admin/*` routes using Keycloak OIDC with PKCE.

## Usage
Refer to `requirements.md` for detailed specifications before implementing any features. This `GEMINI.md` file should be updated as the project evolves from requirements into an active codebase.
