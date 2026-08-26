# Changelog

All notable changes to this project will be documented in this file.

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

## 0.1.0 — Initial release

### Components

- `Button` — primary, secondary, ghost, danger variants; sm/md/lg sizes; loading, fullWidth, iconOnly, startIcon, endIcon
- `Checkbox` — indeterminate support, helperText, error
- `Field` — layout wrapper providing label, description, error, and aria context to children via React Context
- `Form` — thin semantic form wrapper with forwardRef
- `Input` — text input with startIcon, endIcon, helperText, error
- `Radio` — radio input with helperText, error
- `Select` — native select with helperText, error
- `Switch` — toggle with role="switch", helperText, error
- `Textarea` — multiline input with helperText, error

### Hooks

- `useFormField` — shared hook for id generation, aria-describedby, and invalid state
- `useFieldContext` — consume `Field` context from custom form controls

### Foundations

- CSS custom property tokens: colors, spacing, typography, radius, shadows
- Dark mode support via `[data-theme="dark"]` and `prefers-color-scheme`
