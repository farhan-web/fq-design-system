# Contributing to fq-design-system

## Local setup

```bash
git clone https://github.com/HAEID/fq-design-system.git
cd fq-design-system
npm install
npm run dev        # Vite dev server
npm run storybook  # Component explorer
```

## Workflow

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # Library build
```

## Adding a component

1. Create `src/components/ComponentName/` with:
   - `ComponentName.tsx` — component + exported types
   - `ComponentName.css` — scoped styles using design tokens
   - `ComponentName.stories.tsx` — Storybook stories
   - `ComponentName.test.tsx` — unit tests
2. Export from `src/index.ts`
3. All form controls must use `useFormField` and consume `useFieldContext`
4. All components must use `forwardRef` and set `displayName`
5. CSS must use `var(--token)` — no hardcoded values

## Coding conventions

- **Naming**: PascalCase for components, camelCase for hooks/utils
- **CSS classes**: BEM-like with `fq-` prefix (`fq-button`, `fq-button--primary`, `fq-button__spinner`)
- **Props**: extend native HTML attributes where possible, add `FormFieldProps` for form controls
- **Accessibility**: `aria-invalid`, `aria-describedby`, `aria-hidden` must be correct

## Versioning

This project uses [Changesets](https://github.com/changesets/changesets).

Before opening a PR for a user-facing change:

```bash
npm run changeset
```

Follow the prompts to document the change type (patch/minor/major) and description.

## Pull request checklist

- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Format passes (`npm run format:check`)
- [ ] Build passes (`npm run build`)
- [ ] Changeset added for user-facing changes
- [ ] Storybook story updated or added
