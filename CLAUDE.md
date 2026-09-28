# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                        # run all tests (vitest, jsdom)
npx vitest run src/components/Button/Button.test.tsx  # run single test file
npm run test:watch              # watch mode
npm run lint                    # eslint
npm run format:check            # prettier check
npm run format                  # prettier write
npm run build                   # tsc + vite library build → dist/
npm run storybook               # component explorer on :6006
npm run changeset               # add a changeset before merging user-facing changes
```

## Architecture

This is a **React component library** built with Vite. It outputs a single ESM bundle (`dist/fq-design-system.js`) and a single CSS file (`dist/fq-design-system.css`).

### Design tokens

All visual values live in `src/foundations/*.css` as CSS custom properties on `:root`. Components must reference tokens via `var(--token)` — no hardcoded values. `src/index.css` imports all foundation files and is bundled into the output CSS.

Dark mode is handled in `src/foundations/colors.css` via `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`.

### Form field system

Every form control (Input, Checkbox, Select, Switch, Radio, Textarea) follows the same pattern:

1. **`useFormField`** (`src/hooks/useFormField.ts`) — generates stable IDs, derives `message` (error takes priority over helperText), builds `aria-describedby`, and returns `invalid` boolean.

2. **`FieldContext`** (`src/components/Field/FieldContext.ts`) — React context that `Field` provides and form controls consume via `useFieldContext()`. When a control is inside `<Field>`, context values (`id`, `required`, `invalid`, `describedBy`) are merged with the control's own local values (OR for booleans, array merge for `describedBy`).

3. **`Field`** (`src/components/Field/Field.tsx`) — layout wrapper that renders label/description/error and provides `FieldContext`. Accepts `ReactNode` children (no `cloneElement`, no single-child restriction). Custom controls outside this library can integrate by consuming `useFieldContext`.

### Component conventions

- Every component uses `forwardRef` and sets `displayName`.
- Props extend the corresponding native HTML attributes (`InputHTMLAttributes`, etc.) and optionally merge `FormFieldProps` (`label`, `helperText`, `error`).
- CSS follows a `fq-` prefixed BEM-like convention (`fq-button`, `fq-button--primary`, `fq-button__spinner`). One CSS file per component, imported directly in the `.tsx`.
- All components are exported from `src/index.ts` with their prop types.

### Build

`vite.config` is configured in library mode. `vite-plugin-dts` generates `.d.ts` files. The `exports` field in `package.json` exposes the JS bundle and the CSS separately (`fq-design-system/style.css`).
