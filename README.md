# Rate The Landlord — Frontend

[![Website](https://img.shields.io/badge/website-ratethelandlord.org-blue)](https://ratethelandlord.org)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue)](LICENSE.md)

The frontend for **RateTheLandlord.org**, a community-driven platform where
renters can share and discover reviews of landlords.

The application is built with **Next.js, React, TypeScript, Tailwind CSS, Redux
Toolkit, Auth0, PostgreSQL, and Bun**.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Authentication](#authentication)
- [Captcha](#captcha)
- [Internationalization](#internationalization)
- [Docker](#docker)
- [Production Build](#production-build)
- [Contributing](#contributing)
- [License](#license)

## Features

- Landlord reviews and ratings
- Landlord search and discovery
- Review submission and moderation functionality
- Authenticated user functionality through Auth0
- Administrative functionality
- PostgreSQL-backed application data
- Canadian English (`en-CA`) and French (`fr-CA`) localization
- Google reCAPTCHA protection for review submissions
- Map-based functionality using Mapbox
- Client-side analytics through PostHog
- Responsive UI built with Tailwind CSS
- Redux Toolkit for application state
- Accessibility-focused component testing
- SEO metadata and sitemap generation
- Standalone Next.js production builds
- Docker support for production deployment

## Tech Stack

| Area                  | Technology                         |
| --------------------- | ---------------------------------- |
| Framework             | Next.js 14                         |
| UI                    | React 18                           |
| Language              | TypeScript                         |
| Styling               | Tailwind CSS 4                     |
| State management      | Redux Toolkit / React Redux        |
| Authentication        | Auth0                              |
| Database              | PostgreSQL                         |
| Package manager       | Bun                                |
| Testing               | Jest + React Testing Library       |
| Accessibility testing | jest-axe                           |
| Maps                  | Mapbox GL / react-map-gl           |
| Internationalization  | next-intl                          |
| Analytics             | PostHog                            |
| CAPTCHA               | Google reCAPTCHA                   |
| Formatting            | Prettier                           |
| Linting               | ESLint                             |
| Git hooks             | Husky                              |
| Production            | Docker + Next.js standalone output |

## Project Structure

```text
.
├── components/       # Reusable React components
├── lib/              # Shared libraries and application helpers
├── messages/         # Localization messages
├── migrations/       # Database migrations
├── pages/            # Next.js pages and API routes
├── public/            # Static assets
├── redux/             # Redux store and slices
├── styles/            # Global styles
├── types/             # Shared TypeScript types
├── util/              # Utility functions
├── .github/           # GitHub configuration and workflows
├── .husky/            # Git hooks
├── Dockerfile         # Production Docker image
├── compose.yml        # Docker Compose configuration
├── next.config.js     # Next.js configuration
├── tailwind.config.mjs
├── jest.config.js
└── package.json
```

## Prerequisites

For local development, install:

- [Bun](https://bun.sh/)
- Node.js 20 or newer
- PostgreSQL
- An Auth0 application if you need authenticated/admin functionality
- A Google reCAPTCHA configuration if you need to submit reviews locally
- A Mapbox token if you need map functionality

The Docker image currently uses Node.js 20 and installs Bun inside the build
image.

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/RateTheLandlord/rtl-frontend.git
cd rtl-frontend
```

### 2. Create your environment file

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values for your local environment. See
[Environment Variables](#environment-variables).

For normal development, use:

```env
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Install dependencies

```bash
bun install
```

### 4. Configure the database

Set `DATABASE_URL` in `.env` to point to your PostgreSQL database.

Apply the SQL files in the `migrations/` directory in the required order.

### 5. Start the development server

```bash
bun dev
```

The application will be available at:

```text
http://localhost:3000
```

Next.js will automatically reload the application as files are changed.

## Environment Variables

The repository includes an `.env.example` containing the variables expected by
the application.

### Application

| Variable                  | Purpose                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_ENVIRONMENT` | Current environment, such as `development` or `production` |
| `PORT`                    | Port used by the application                               |
| `ORIGIN_URL`              | Server-side application origin                             |
| `NEXT_PUBLIC_ORIGIN_URL`  | Public application origin                                  |

### Database

| Variable       | Purpose                      |
| -------------- | ---------------------------- |
| `DATABASE_URL` | PostgreSQL connection string |

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database"
```

### CAPTCHA

| Variable                       | Purpose                      |
| ------------------------------ | ---------------------------- |
| `NEXT_PUBLIC_CAPTCHA_SITE_KEY` | Public reCAPTCHA site key    |
| `CAPTCHA_SECRET_KEY`           | Server-side reCAPTCHA secret |

### Auth0

| Variable                | Purpose                               |
| ----------------------- | ------------------------------------- |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant URL                      |
| `AUTH0_CLIENT_ID`       | Auth0 application client ID           |
| `AUTH0_CLIENT_SECRET`   | Auth0 application client secret       |
| `AUTH0_BASE_URL`        | Base URL of the application           |
| `AUTH0_SECRET`          | Secret used by Auth0 session handling |

### External Services

| Variable                   | Purpose                   |
| -------------------------- | ------------------------- |
| `OPENAI_API_KEY`           | OpenAI API access         |
| `NEXT_PUBLIC_GMAPS_TOKEN`  | Google Maps functionality |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox functionality      |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host              |
| `NEXT_PUBLIC_POSTHOG_KEY`  | PostHog project key       |

### Review Configuration

| Variable        | Purpose                                  |
| --------------- | ---------------------------------------- |
| `REVIEW_PERIOD` | Review-related application configuration |

> **Security:** Never commit real secrets, database passwords, API keys, Auth0
> secrets, or CAPTCHA secrets to the repository.

## Database

The frontend uses PostgreSQL through the `postgres` package.

Set the connection string using `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@host:5432/database"
```

Database changes are stored in `migrations/`.

When setting up a new development database:

1. Create a PostgreSQL database.
2. Set `DATABASE_URL`.
3. Run the migration SQL files in order.
4. Start the frontend.

The frontend repository contains database-related server functionality, so a
working PostgreSQL connection is required for features that access application
data.

## Available Scripts

Run these commands with Bun:

| Command           | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `bun dev`         | Start the Next.js development server                         |
| `bun build`       | Create a production Next.js build                            |
| `bun start`       | Start the production server                                  |
| `bun start:debug` | Start Next.js with the Node inspector enabled                |
| `bun lint`        | Run ESLint and automatically fix supported issues            |
| `bun lint:merge`  | Run ESLint without automatically fixing files                |
| `bun format`      | Format frontend TypeScript/TSX files with Prettier           |
| `bun tsc`         | Run the TypeScript compiler                                  |
| `bun test`        | Run Jest in watch mode                                       |
| `bun test:merge`  | Run Jest for merge/CI-style validation                       |
| `bun knip`        | Check for unused production files, exports, and dependencies |

The build also runs `next-sitemap` after a successful Next.js build.

## Testing

The project uses:

- Jest
- React Testing Library
- `@testing-library/jest-dom`
- `jest-axe`
- `next-router-mock`

Run the test suite with:

```bash
bun test:merge
```

For interactive development:

```bash
bun test
```

### Accessibility

Components can include accessibility assertions using `jest-axe`.

When adding or significantly changing UI components, include appropriate tests
for:

- Rendering
- User interactions
- Important application states
- Accessibility violations

## Linting and Formatting

ESLint and Prettier are used to maintain consistent code quality.

Run linting:

```bash
bun lint
```

Run the non-fixing lint command:

```bash
bun lint:merge
```

Format files:

```bash
bun format
```

Type-check the project:

```bash
bun tsc
```

### Pre-commit Hooks

Husky is configured for Git hooks, and `lint-staged` runs ESLint against staged
TSX files.

After installing dependencies, Husky is initialized through the `prepare`
script.

If a commit is rejected, run the relevant checks manually and fix the reported
issues before committing.

## Authentication

Authentication is handled through Auth0 using `@auth0/nextjs-auth0`.

For local authenticated/admin development, configure the Auth0 environment
variables in `.env`.

Administrative functionality expects an Auth0 role claim. The project currently
uses the `ADMIN` role for administrator access.

The Auth0 configuration must expose the user's role as a custom claim during
login.

Do not commit Auth0 credentials or secrets.

## CAPTCHA

Review submission uses Google reCAPTCHA.

To test review submission locally:

1. Create/configure a reCAPTCHA application.
2. Add the public site key to `NEXT_PUBLIC_CAPTCHA_SITE_KEY`.
3. Add the server secret to `CAPTCHA_SECRET_KEY`.
4. Configure your local development hostname as required by the CAPTCHA
   provider.

Example:

```env
NEXT_PUBLIC_CAPTCHA_SITE_KEY="your-site-key"
CAPTCHA_SECRET_KEY="your-secret-key"
```

## Internationalization

The application supports:

- `en-CA` — English (Canada)
- `fr-CA` — French (Canada)

`en-CA` is the default locale.

Translation messages are stored in:

```text
messages/
```

Next.js is configured with `next-intl` and the application's locale
configuration.

When adding user-facing text, use the project's existing internationalization
system rather than hard-coding text directly into components.

## Docker

The repository includes a production `Dockerfile` and `compose.yml`.

### Build the image

```bash
docker build -t rate-the-landlord-frontend .
```

### Run with Docker Compose

Create a production/local `.env` file first, then:

```bash
docker compose up -d --build
```

The included Compose configuration exposes the application on port `3000`:

```text
http://localhost:3000
```

### Production Image

The Dockerfile uses a multi-stage build:

1. Install dependencies with Bun.
2. Build the Next.js application.
3. Copy the standalone Next.js output into a smaller runtime image.
4. Run the application as a non-root `nextjs` user.

The application is configured with:

```js
output: 'standalone'
```

The production container listens on port `3000`.

## Production Build

To test the production build locally:

```bash
bun build
bun start
```

The build generates the Next.js production output and then runs `next-sitemap`.

The project also includes explicit handling for the Linux x64 `bcrypt` native
binary in its standalone Docker build.

## Contributing

Contributions are welcome.

Before starting work, please read [CONTRIBUTING.md](CONTRIBUTING.md).

The current development workflow is:

1. Find or create an issue describing the work.
2. Create your branch from `develop`.
3. Make your changes.
4. Add or update tests where appropriate.
5. Run the relevant lint, type-check, and test commands.
6. Open a pull request targeting `develop`.
7. Address review and CI feedback.

## Community

- Website: <https://ratethelandlord.org>
- Email: <contact@ratethelandlord.org>
- GitHub: <https://github.com/RateTheLandlord>

## License

This project is licensed under the **GNU General Public License v3.0**.

See [LICENSE.md](LICENSE.md) for the full license text.
