# fq-design-system

A lightweight, accessible React design system built with CSS custom properties.

- **Zero runtime dependencies** beyond React
- **Accessible** — ARIA attributes, keyboard navigation, focus management
- **Themeable** — all values are CSS custom properties; dark mode included
- **TypeScript-first** — full type coverage, all props extend native HTML attributes

## Installation

```bash
npm install fq-design-system
```

Add the stylesheet once in your app entry:

```ts
import 'fq-design-system/style.css';
```

**Peer dependencies:** React ≥ 18

## Usage

```tsx
import { Button, Input, Field, Form } from 'fq-design-system';

function LoginForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Field label="Email" required description="Use your work email.">
        <Input type="email" placeholder="you@company.com" />
      </Field>
      <Button type="submit">Log in</Button>
    </Form>
  );
}
```

## Components

| Component  | Description |
|---|---|
| `Button`   | primary, secondary, ghost, danger · sm/md/lg · loading, fullWidth, iconOnly |
| `Checkbox` | indeterminate support · helperText, error |
| `Field`    | layout wrapper — provides label, description, error, and aria context to children |
| `Form`     | semantic `<form>` wrapper with forwardRef |
| `Input`    | text input · startIcon, endIcon · helperText, error |
| `Radio`    | radio input · helperText, error |
| `Select`   | native `<select>` · helperText, error |
| `Switch`   | toggle with `role="switch"` · helperText, error |
| `Textarea` | multiline input · helperText, error |

## Theming

All design tokens are CSS custom properties on `:root`. Override them in your own stylesheet:

```css
:root {
  --color-primary: #7c3aed;
  --color-primary-hover: #6d28d9;
  --font-family: 'Inter', sans-serif;
}
```

### Dark mode

Dark mode works automatically via `prefers-color-scheme`, or you can control it explicitly:

```html
<!-- Force dark -->
<html data-theme="dark">

<!-- Force light (disables system preference) -->
<html data-theme="light">
```

## Custom form controls with Field

To make your own component work inside `<Field>`, consume `useFieldContext`:

```tsx
import { useFieldContext } from 'fq-design-system';

function MyInput(props) {
  const field = useFieldContext();

  return (
    <input
      {...props}
      id={field?.id ?? props.id}
      required={field?.required || props.required}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
    />
  );
}
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
