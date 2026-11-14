# Application architecture

RateTheLandlord is a single full-stack Next.js application. The Pages Router remains the routing system; this layout is an organization change, not an App Router migration or a backend split.

## Top-level boundaries

- `pages/`: Next.js Pages Router entry points, including API routes. Keep route modules focused on HTTP concerns, request validation, authentication/authorization checks, and delegating to application code.
- `src/`: Application source code. Runtime application modules belong here rather than in new root-level source directories.
- `migrations/`: Ordered database schema/data migrations. Keep these at the root so database tooling and operational workflows can find them consistently.
- `messages/`: Translation resources consumed by the existing internationalization setup.
- `public/`: Static assets served directly by Next.js.
- `docs/`: Project and architecture documentation.

## Source directories

### `src/components/`

React UI grouped by feature and shared purpose. Existing feature folders such as `reviews/`, `landlord/`, `create-review/`, `city/`, and `admin/` should own UI that is specific to those areas.

Shared UI belongs in the existing shared-purpose folders, such as `ui/`, `layout/`, `modal/`, and `svg/`. Do not move a component into a shared folder solely because reuse might be possible later.

Keep component tests beside the component they exercise.

### `src/lib/`

Application and domain logic that is not itself a React component. Existing domain groupings (for example `review/`, `tenant-resource/`, `landlord-tools/`, and `suspicious-landlords/`) should remain cohesive.

Database access and other server-only code must only be imported from server-side entry points. Do not import database modules, secrets, or Node-only dependencies into browser components. A later domain refactor can make server-only modules more explicit without mixing that work into this filesystem migration.

### `src/redux/`

The Redux Toolkit store, typed hooks, and slices. Keep this directory for store composition and cross-feature state infrastructure. When a slice becomes tightly coupled to one feature, consider colocating it with that feature in a separate, reviewed change rather than moving state as part of an unrelated UI change.

### `src/util/`

Small, broadly reusable helpers, hooks, and static location datasets. Utilities should remain genuinely generic; feature-specific business rules belong with the owning domain in `src/lib/` or its feature.

### `src/types/`

Types that are genuinely shared across unrelated parts of the application. Prefer keeping feature-specific types beside their feature or domain implementation.

### `src/styles/`

Global styles and shared styling entry points. Component-specific styling should remain close to the component where practical.

## Import conventions

- Use the `@/` alias for application source imports (for example, `@/components/reviews/ReviewComponent` or `@/lib/db`).
- Use relative imports for nearby files within the same cohesive folder.
- Avoid reaching across unrelated feature folders with long relative paths.
- Do not add new application source directories at the repository root.
- Keep framework and tooling configuration files at the root where their tools expect them.

## Pages Router conventions

The root-level `pages/` directory is intentional and must not be moved under `src/` while the application uses the Pages Router. Page and API route modules should compose UI or delegate work; reusable logic should live under `src/`.

## Scope of this migration

This change establishes a clear source-code boundary while preserving existing module names and internal folder relationships. It deliberately does not rename domains, rewrite business logic, change API behavior, migrate routing systems, or redesign the database layer. Those changes should be made incrementally with tests and dependency boundaries reviewed independently.
