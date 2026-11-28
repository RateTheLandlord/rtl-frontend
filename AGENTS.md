<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Rate The Landlord project guidance

### Toolchain and setup

- Use Node.js 24 as declared in `.node-version` and Bun 1.4.5 as declared in `package.json`.
- Install dependencies with `bun install --frozen-lockfile`.
- Keep the Dockerfile and CI workflow on the same Node.js and Bun versions.
- Start from `.env.example`; never commit populated environment files or secrets. Local development requires PostgreSQL. Production also requires complete Auth0 configuration and the CAPTCHA secret.

### Project structure

- This application uses the Next.js App Router. Localized pages live under `app/[locale]/`; API route handlers live under `app/api/`.
- Put reusable UI and application logic in `src/components/` and `src/lib/`; see `docs/architecture.md` for placement conventions.
- Auth0 request handling and locale routing are composed in root `proxy.ts`.

### Next.js changes

- The Next.js-managed block above is generated from the installed Next.js version. Preserve it and add project guidance outside its markers.
- Before changing Next.js APIs or file conventions, read the matching guide in the installed package at `node_modules/next/dist/docs/`.

### Validation

- Pull request CI runs `bun run lint:merge`, `bun run test:ci`, and `bun run tsc`.
- CI and Docker run the production build under Node.js 24 with `npm run build`.
