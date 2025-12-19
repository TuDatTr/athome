# Requirements for CV Website

This document outlines the functional, non-functional, and technical requirements for the CV/Portfolio website.

## 1. Functional Requirements

### 1.1 Core CV/Portfolio Display
*   The system SHALL display CV and portfolio content to public users.
*   The public-facing website SHALL support multi-language content (English and German).
*   The website SHALL display profile information, experience, education, and skills.
*   The website SHALL display projects (implied by `004_add_projects.ts` migration).
*   The website SHALL utilize HTMX for dynamic content updates and interactive elements without full page reloads.

### 1.2 Content Management System (CMS)
*   The system SHALL provide an administrative interface for managing CV/portfolio content.
*   The CMS SHALL support creating, reading, updating, and deleting (CRUD) content for profile, experience, education, skills, and projects.
*   The CMS SHALL support managing translations for all content types, keyed by `language_code`.
*   The CMS administration forms and interactions SHALL leverage HTMX for partial page updates and improved responsiveness.

### 1.3 Authentication & Authorization
*   The CMS SHALL require authentication for access.
*   Authentication SHALL be handled via OpenID Connect (OIDC) using Keycloak as the Identity Provider.
*   The system SHALL integrate with Keycloak for user login and session management.
*   The system SHALL protect administrative routes (`/admin/*`) from unauthenticated access.
*   The authentication flow SHALL involve redirecting to Keycloak for login, handling callbacks, exchanging `code` for tokens (PKCE enabled), and setting a session cookie.

### 1.4 Internationalization (i18n)
*   The system SHALL support content in at least English and German.
*   Content SHALL be stored using a "Translation Table" database pattern.

## 2. Non-Functional Requirements

### 2.1 Performance
*   The public-facing website SHALL be server-side rendered (SSR) with HTMX enhancing interactivity.

### 2.2 Scalability & Data Persistence
*   The system SHALL use SQLite for data persistence.
*   The database schema SHALL support structural tables (e.g., `profile`, `experience`) and corresponding translation tables (e.g., `profile_translations`).

### 2.3 User Experience (UX) & Design
*   The frontend SHALL utilize TailwindCSS for styling.
*   The website SHALL support dark mode via a toggler and `dark:` prefix utility classes.
*   The user experience SHALL benefit from reduced page reloads due to HTMX-driven dynamic content.

### 2.4 Security
*   Authentication SHALL follow secure OIDC practices (PKCE enabled).
*   Environment variables SHALL be used for sensitive configuration (e.g., Keycloak secrets).

### 2.5 Maintainability
*   The codebase SHALL be structured into logical components (e.g., `components`, `db`, `routes`).
*   Database read operations (`queries.ts`) and write operations (`mutations.ts`) SHALL be separated.

## 3. Technical Requirements / Stack


### 3.3 Templating
*   **HTMX** for dynamic, partial updates.

### 3.4 Database
*   **SQLite** via (Native SQLite driver)

### 3.5 Authentication Libraries
*   **Arctic** (OIDC Client)
*   **Keycloak** (Identity Provider)

### 3.6 Styling
*   **TailwindCSS** (with custom animations configured in `tailwind.config.js`)

### 3.7 Development Tools
*   **TypeScript** (configured via `tsconfig.json`)

### 3.8 Containerization
*   **Docker** (for Keycloak deployment)

## 4. Architecture

### 4.1 Directory Structure
*   `src/components`: Reusable UI components (now focusing on server-rendered HTML snippets compatible with HTMX).
*   `src/db`: Database logic (schema, queries, mutations, seed, migrations).
*   `src/routes`: Route handlers (public and admin, serving HTML responses optimized for HTMX).
*   `src/index.tsx`: Main application entry point.
*   `tests`: Unit tests.

### 4.2 Database Schema
*   Translation Table pattern with structural and translation tables.

## 5. Development Workflow

### 5.1 Prerequisites
*   Docker installed.

### 5.2 Setup & Installation
*   `docker compose up -d` to start Keycloak.

### 5.3 Running the Application
*   Application accessible at `http://localhost:3000`.

### 5.4 Testing

## 6. Conventions
*   **Routing:** Use `return Response.redirect(...)` for redirects.
*   **Styling:** Use Tailwind utility classes; support dark mode.
*   **Data Access:** Separate `queries.ts` (read) and `mutations.ts` (write).
*   **HTMX:** Apply HTMX attributes to HTML elements for declarative client-side interactivity.
