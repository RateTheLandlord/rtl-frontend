# Application architecture

RateTheLandlord is a single full-stack Next.js application. The application is migrating incrementally from the Pages Router to the App Router; both route trees currently coexist. This is a routing migration, not a backend split.

## Top-level boundaries

- `app/`: Next.js App Router layouts and page entry points. Localized pages live under `app/[locale]/` and share its locale-aware layout and providers.
- `pages/`: Remaining Next.js Pages Router entry points, including API routes and pages not yet migrated. Keep route modules focused on HTTP concerns, request validation, authentication/authorization checks, and delegating to application code.
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

## Router conventions

The `app/` and root-level `pages/` directories coexist during the migration. API routes remain in `pages/api/`; do not migrate them as part of public page work. New or migrated public pages should use the App Router and the existing `app/[locale]/` route structure. Keep route modules focused on composing UI; reusable logic belongs under `src/`.

## Scope of the source layout

Application source remains under `src/`, while framework route entry points remain at the repository root. Keep the routing migration incremental: preserve public URLs and locale behavior, move one page or cohesive group at a time, and avoid mixing in domain renames, API behavior changes, or database redesign.


## Naming conventions

Use consistent casing for application source files and directories:

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase | `ReviewComponent.tsx` |
| Component tests | Match the component filename | `ReviewComponent.test.tsx` |
| Hooks | camelCase | `useInfiniteScroll.ts` |
| Utilities, services, and helpers | camelCase | `fetchReviews.ts` |
| Type-only modules | PascalCase | `ReviewTypes.ts` |
| Source directories | camelCase | `createReview/`, `postHog/` |

Use descriptive names; avoid abbreviations unless they are established project or technology names (for example, `SEO`, `Map`, or `PH`).

### Names that must remain stable

Do not blindly rename files or directories whose names are part of an external contract:

- App Router and Pages Router files and folders define public page and API URLs. Preserve their current paths and locale behavior during migration.
- Files under `public/` are served by URL. Preserve paths referenced by HTML, CSS, metadata, sitemap/robots conventions, external integrations, or existing links.
- Localization message filenames are namespaces consumed by the i18n setup. Rename them only alongside every namespace reference and test.
- Database migration filenames and their numeric ordering are part of migration discovery and execution.
- Framework and tool configuration filenames must retain the names expected by their tools.

When renaming an application source module, update every static and dynamic import, test mock, alias, and documentation reference in the same change. Treat case-only renames carefully because they can be missed on case-insensitive development filesystems.
