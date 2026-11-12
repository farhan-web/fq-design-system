# Repository Guidelines

## Required Steering & Context

Before implementation, read [steering](docs/steering/README.md),
[current context](docs/steering/current-context.md), and the relevant task in
[the readiness plan](docs/production-readiness-plan.md). Follow their lifecycle:
validate context against code, record decisions, and update status with evidence
before handoff. Update context prose, run `npm run steering:refresh --
--task=<ID> --summary="<review>" --next=<ID>`, then `npm run steering:check`.
Re-review after source/policy/baseline changes. Planned tooling is not implemented tooling. Use browser DOM,
computed styles, layout, and behavior checks; do not use screenshot validation.

## Project Structure & Module Organization

This React and TypeScript component library uses Vite for builds and Storybook
for component documentation.

- `src/components/ComponentName/`: component implementation, CSS, stories, and
  colocated tests.
- `src/hooks/` and `src/types/`: shared hooks and form contracts.
- `src/foundations/`: CSS design tokens and foundation stories.
- `src/theme/`: theme configuration and provider.
- `src/assets/` and `public/`: bundled fonts and static assets.
- `src/index.ts`: public library exports; export new components here.
- `.storybook/`: Storybook configuration; `scripts/`: token and screenshot tools.
- `dist/`, `storybook-static/`, and `coverage/`: generated output.

## Build, Test, and Development Commands

Install dependencies with `npm ci` for reproducible setup.

- `npm run dev`: start the Vite development server.
- `npm run storybook`: explore components on port 6006.
- `npm run build`: run TypeScript checks and build the library into `dist/`.
- `npm run build-storybook`: generate static component documentation.
- `npm test`: run the Vitest suite once.
- `npm run test:watch`: rerun tests during development.
- `npm run test:coverage`: run tests with coverage thresholds.
- `npm run lint`: check ESLint rules, including React Hooks rules.
- `npm run format` / `npm run format:check`: apply or verify Prettier formatting.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, single quotes, trailing commas, and an
80-column target, as configured in `.prettierrc.json`. Name components and their
folders in PascalCase; use camelCase for hooks and utilities.

Follow `CONTRIBUTING.md`: use `forwardRef` and set `displayName`, extend native
HTML props where appropriate, and integrate form controls with `useFormField`
and `useFieldContext`. Use CSS custom-property tokens for design values and
BEM-like classes prefixed with `fq-`, such as `fq-button--primary`.

## Testing Guidelines

Use Vitest, jsdom, React Testing Library, and jest-dom. Colocate tests as
`ComponentName.test.tsx` or `useHookName.test.ts`. Cover interactions, keyboard
navigation, disabled states, and ARIA relationships using role-based queries.
Coverage requires 80% lines, 80% functions, and 70% branches for components and
hooks; stories are excluded.

## Commit & Pull Request Guidelines

Follow existing commit prefixes: `feat:`, `refactor:`, and `style:` with concise,
imperative descriptions. PRs should describe behavior changes, link relevant
issues, and include DOM/style/layout evidence for visual changes. Add or update Storybook
stories and run lint, formatting checks, coverage, and the build before review.
For user-facing changes, run `npm run changeset` and commit the generated entry.
