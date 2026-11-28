# Rate The Landlord

[![Website](https://img.shields.io/badge/website-ratethelandlord.org-blue)](https://ratethelandlord.org)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue)](LICENSE.md)

**Rate The Landlord** is a community-driven platform that helps renters share their experiences with landlords and discover information about rental housing.

The application is a full-stack [Next.js](https://nextjs.org/) application. It provides the user interface, server-side functionality, API routes, authentication, and database access within a single repository.

**Website:** https://ratethelandlord.org

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database](#database)
- [Available Commands](#available-commands)
- [Testing and Code Quality](#testing-and-code-quality)
- [Authentication and Security](#authentication-and-security)
- [Internationalization](#internationalization)
- [Production Deployment](#production-deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Landlord reviews:** Submit and discover reviews of landlords.
- **Search and discovery:** Find landlord information and existing reviews.
- **Review moderation:** Support for managing inappropriate or spam submissions.
- **User authentication:** Authenticated functionality powered by Auth0.
- **Administration:** Administrative features with role-based access.
- **Database integration:** PostgreSQL-backed application data.
- **Internationalization:** Canadian English (`en-CA`) and French (`fr-CA`).
- **Location-based functionality:** Map integrations for supported features.
- **Spam protection:** Google reCAPTCHA integration for review submissions.
- **Analytics:** Product analytics using PostHog.
- **SEO:** Search engine metadata, sitemap generation, and environment-specific indexing.
- **Responsive interface:** React components styled with Tailwind CSS.
- **Accessibility testing:** Automated component accessibility checks.

See [docs/posthog-events.md](docs/posthog-events.md) for the current PostHog event inventory.

## Technology Stack

| Area | Technology |
| --- | --- |
| Full-stack framework | Next.js 16 |
| UI library | React |
| Language | TypeScript |
| Routing | Next.js App Router |
| Styling | Tailwind CSS 4 |
| State management | Redux Toolkit and React Redux |
| Data fetching | SWR |
| Database | PostgreSQL |
| Database client | `postgres` |
| Authentication | Auth0 |
| Password hashing | bcrypt |
| Internationalization | next-intl |
| Maps | Mapbox GL and react-map-gl |
| Analytics | PostHog |
| CAPTCHA | Google reCAPTCHA |
| Package manager | Bun |
| Unit and component testing | Jest and React Testing Library |
| Accessibility testing | jest-axe |
| Linting | ESLint |
| Formatting | Prettier |
| Git hooks | Husky |
| Production runtime | Node.js |
| Containerization | Docker |

## Architecture

Rate The Landlord is maintained in a **single full-stack repository**. The former standalone backend is no longer part of the active application architecture.

Next.js handles both the frontend and server-side application functionality, including API routes and database operations.

The application uses the Next.js App Router. Localized pages live under `app/[locale]/`, and API routes live under `app/api/`.

### Repository structure

```text
.
├── .github/           # GitHub workflows and repository automation
├── app/               # Next.js App Router layouts, pages, and API routes
│   ├── [locale]/      # Localized pages
│   └── api/           # API endpoints
├── docs/              # Architecture and project documentation
├── migrations/        # Ordered database migrations
├── messages/          # Localization messages
├── proxy.ts           # Auth0 and locale request handling
├── public/            # Static assets
├── src/               # Application source code
│   ├── components/    # UI, grouped by feature and shared purpose
│   ├── lib/           # Domain logic and application services
│   ├── redux/         # Redux store and state slices
│   ├── styles/        # Global styles
│   ├── types/         # Shared TypeScript types
│   └── util/          # Utilities, hooks, and location data
├── Dockerfile         # Production container image
├── compose.yml        # Docker Compose configuration
├── next.config.ts     # Next.js configuration
├── package.json       # Dependencies and scripts
└── bun.lock           # Bun dependency lockfile
```

Route modules should stay focused and delegate reusable work to `src/`. See [docs/architecture.md](docs/architecture.md) for directory responsibilities, placement rules, and naming conventions.
## Prerequisites

For local development, you will need:

- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/) compatible with the installed Next.js version
- PostgreSQL
- Access to the credentials for any external services required by the features you are developing

Auth0, Google reCAPTCHA, map services, and PostHog require their respective configurations when working on functionality that depends on them.

Docker is optional for local development but useful for validating the production container.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RateTheLandlord/rtl-frontend.git
cd rtl-frontend
```

### 2. Use the development branch

`develop` is the primary branch for day-to-day development.

```bash
git switch develop
```

### 3. Configure environment variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Populate the values required for your local environment. See [Environment Configuration](#environment-configuration).

Never commit credentials, production secrets, or populated local environment files.

### 4. Install dependencies

```bash
bun install
```

Use Bun and the committed lockfile to keep dependency resolution consistent across development environments.

### 5. Configure PostgreSQL

Create a development database and set `DATABASE_URL` in `.env`.

Apply the SQL migrations from `migrations/` in the order required by the application.

See [Database](#database) for more information.

### 6. Start the development server

```bash
bun run dev
```

The application will be available at:

http://localhost:3000

Next.js provides hot reloading during development.

## Environment Configuration

The repository includes an `.env.example` file. Use it as the starting point and consult the source code for any additional variables required by the feature you are working on.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ENVIRONMENT` | Identifies the current application environment |
| `PORT` | Application server port |
| `ORIGIN_URL` | Server-side application origin |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH0_DOMAIN` | Auth0 tenant domain |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |
| `APP_BASE_URL` | Application base URL used by Auth0 |
| `AUTH0_SECRET` | Secret used for Auth0 session handling |
| `NEXT_PUBLIC_CAPTCHA_SITE_KEY` | Public reCAPTCHA site key |
| `CAPTCHA_SECRET_KEY` | Server-side reCAPTCHA secret |
| `OPENAI_API_KEY` | OpenAI API access for features that use it |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox integration |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key |
| `NEXT_PUBLIC_API_URL` | API base URL used by sitemap generation |
| `NEXT_PUBLIC_DOMAIN_URL` | Public site URL prefix used by sitemap generation (include trailing slash) |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Twitter handle used in SEO metadata |
| `REVIEW_PERIOD` | Review-related application configuration |

Not every variable is required for every development task. `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_DOMAIN_URL` are used by the server sitemap route; `NEXT_PUBLIC_TWITTER_HANDLE` is used in SEO metadata. The other integrations can be left unset when you are not working on the features that use them. The Dockerfile accepts public build-time settings for client-side integrations.

The server checks its environment when it starts. `DATABASE_URL` must be a PostgreSQL URL. In production, Auth0 settings and `CAPTCHA_SECRET_KEY` are required; in development, Auth0 settings may all be left blank, but partial Auth0 configuration is rejected. Public `NEXT_PUBLIC_` values are build-time settings and are not checked by the server startup validator.

The server checks its environment when it starts. `DATABASE_URL` must be a PostgreSQL URL. In production, Auth0 settings and `CAPTCHA_SECRET_KEY` are required; in development, Auth0 settings may all be left blank, but partial Auth0 configuration is rejected. Public `NEXT_PUBLIC_` values are build-time settings and are not checked by the server startup validator.

Variables prefixed with `NEXT_PUBLIC_` may be exposed to the browser. Do not put secrets in them.

Admin access uses the Auth0 Action claim `https://ratethelandlord.org/roles`. The app copies that claim to `session.user.role` when creating the session and checks for the value `ADMIN`. The login route is `/auth/login` (the localized `/login` page redirects there); after Auth0 returns through `/auth/callback`, users go to the localized login completion page, which sends admins to their admin page and other users to the homepage. Role changes apply after the user starts a new session.

## Database

The application uses PostgreSQL through the `postgres` package.

Configure the connection with `DATABASE_URL`:

```dotenv
DATABASE_URL="postgresql://username:password@localhost:5432/database"
```

For a new development database:

1. Create the PostgreSQL database.
2. Configure `DATABASE_URL`.
3. Apply the SQL files in `migrations/` in the appropriate order.
4. Start the application and verify database connectivity.

Database schema changes should be accompanied by the appropriate migration files. Review existing migration conventions before making schema changes.

The application includes server-side database functionality, so a working PostgreSQL connection is required for features that access persisted application data.

## Available Commands

Run project commands through Bun.

| Command | Description |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Build the production application |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint and automatically fix supported issues |
| `bun run lint:merge` | Run ESLint without automatically fixing files |
| `bun run format` | Format TypeScript and TSX files under `app/` and `src/`, plus `proxy.ts` |
| `bun run tsc` | Run TypeScript type checking |
| `bun run test` | Run Jest in watch mode |
| `bun run test:merge` | Run Jest tests related to changed files without watch mode |
| `bun run test:ci` | Run the full Jest suite once, serially |
| `bun run knip` | Check for unused production files, exports, and dependencies |

The production build also runs `next-sitemap` to generate sitemap output.

## Testing and Code Quality

The project uses Jest and React Testing Library for unit and component tests.

Run tests related to changed files during local development:

```bash
bun run test:merge
```

Run the full test suite once:

```bash
bun run test:ci
```

For interactive test development:

```bash
bun run test
```

Run type checking:

```bash
bun run tsc
```

Run the non-fixing lint command:

```bash
bun run lint:merge
```

Format supported files:

```bash
bun run format
```

### Testing expectations

When adding or changing functionality:

- Add or update tests for relevant behavior.
- Test important success, failure, and validation states.
- Mock external services where appropriate.
- Include accessibility assertions for relevant UI components.
- Run the applicable tests, type checks, and lint checks before opening a pull request.

The project uses `jest-axe` to help detect accessibility violations in component tests.

### Git hooks

Husky manages Git hooks, and `lint-staged` is configured to run ESLint on staged TSX files.

Dependency installation initializes Husky through the package's `prepare` script.

## Authentication and Security

### Authentication

Authentication is implemented with Auth0 using `@auth0/nextjs-auth0`.

The Auth0 SDK handles `/auth/login`, `/auth/callback`, and the other `/auth/*` endpoints. The localized `/login` page redirects to `/auth/login`; successful login lands on the localized `/login/complete` page. That page redirects users with the `ADMIN` role to the admin area and other users to the homepage. Register `${APP_BASE_URL}/auth/callback` as an allowed callback URL in Auth0 and use the current environment's app URL for its allowed logout and web origin settings.

Configure an Auth0 Action to add the role as the namespaced claim `https://ratethelandlord.org/roles`. The app reads that claim when saving the session and exposes it as `user.role`. Admin authorization checks for the exact value `ADMIN`. The same namespace is used in every environment; configure the allowed callback URL and application base URL for the active host.

### Application security

The Next.js configuration includes security response headers, including:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`

Review the existing security conventions when modifying authentication, API routes, user input handling, or response headers.

Never commit secrets or expose server-only credentials to client-side code.

### CAPTCHA

Google reCAPTCHA protects review submission.

Configure the public site key and server-side secret to test the relevant functionality locally. Ensure the CAPTCHA provider permits the hostname used by your development environment.

## Internationalization

The application supports:

- `en-CA` — English (Canada)
- `fr-CA` — French (Canada)

English Canadian (`en-CA`) is the default locale.

Translation resources are maintained in `messages/`, and the application uses its existing next-intl integration.

When introducing or modifying user-facing text, use the established localization system rather than hard-coding strings into components.

Both supported locales should be considered when changing UI text, validation messages, or user-facing errors.

## Production Deployment

The application is containerized with Docker and configured to use Next.js standalone output.

The production image is built using a multi-stage Dockerfile. It installs dependencies with Bun, builds the application, and copies the standalone output into a smaller Node.js runtime image. The application runs as a non-root user and listens on port `3000`.

### Build and run with Docker

Build the production image:

```bash
docker build -t rate-the-landlord .
```

Run the image locally:

```bash
docker run --rm -p 3000:3000 --env-file .env rate-the-landlord
```

Alternatively, use the included Docker Compose configuration:

```bash
docker compose up -d --build
```

The application should then be accessible at:

http://localhost:3000

Ensure all required environment variables are configured for the intended environment.

### Production configuration

The Next.js configuration uses:

```typescript
output: 'standalone'
```

The build also includes explicit handling for the Linux x64/glibc native `bcrypt` binary, which is needed by the production container.

Public environment variables used by client-side functionality may need to be supplied at image build time. Follow the Dockerfile's build arguments when producing a deployment image.

The project is deployed through its existing container-based deployment workflow. Changes to application code, dependencies, or build configuration should be validated against the production image before release.

## Contributing

Contributions are welcome!

Read [CONTRIBUTING.md](CONTRIBUTING.md) before starting work.

The standard development workflow is:

1. Find or create an issue describing the proposed change.
2. Create a feature branch from `develop`.
3. Implement the change and add or update tests.
4. Run the relevant test, lint, and type-check commands.
5. Open a pull request targeting `develop`.
6. Address review feedback and resolve any failing checks.

**Branching conventions:**

- `develop` is the primary development branch.
- Pull requests for ordinary development should target `develop`.
- Follow the repository's release process for production changes.

Keep changes consistent with the router used by the affected route, the shared localization conventions, TypeScript practices, and application patterns.

## License

Rate The Landlord is licensed under the **GNU General Public License v3.0**.

See [LICENSE.md](LICENSE.md) for the complete license text.
