# fq-design-system

A lightweight, accessible React design system built with CSS custom properties.

- **React + MUI v6** with Emotion as required peer dependencies
- **Accessibility features** — ARIA attributes and keyboard interactions
- **Themeable** — CSS custom properties and light/dark themes
- **TypeScript-first** — exported component and prop types

## Installation

```bash
npm install fq-design-system 'react@^19.2.8' 'react-dom@^19.2.8' '@mui/material@^6.5.0' '@emotion/react@^11.14.0' '@emotion/styled@^11.14.1'
```

For new integrations, add the isolated stylesheet once and enable MUI layers:

```ts
import 'fq-design-system/isolated.css';
```

`isolated.css` leaves body, headings and links to your app. `reset.css` is an
optional application reset. Existing `style.css` behavior remains available,
including its global reset, and `compat.css` is an explicit alias of it. Choose
one mode; see the [stylesheet migration guide](CONTRIBUTING.md#stylesheet-modes).

Required peer ranges: React/React DOM `^18.3.1 || ^19.2.8`, MUI `^6.5.0`,
Emotion React `^11.14.0`, and Emotion Styled `^11.14.1`. Use matching React and
React DOM versions. MUI/Emotion are shared peers, not optional integrations.
Lucide is only used in development examples; any React SVG icon can be supplied.

Node support for tooling and SSR: `^20.19.0 || ^22.13.0 || >=24.0.0`.
The CI matrix targets Node 20.19.0, 22.13.0, and 24.8.0. This aligns the minimum
with the installed Vite, ESLint, and jsdom toolchain; Node 18 is no longer supported.
See [Vite requirements](https://vite.dev/guide/).

For React 18.3.1, install matching React/DOM and `react-is@18.3.1`, and add this
application-level npm override before installation:

```json
{
  "overrides": { "react-is": "18.3.1" }
}
```

MUI v6 uses React 19 element detection; matching `react-is` avoids mismatches on
React 18. See [the MUI migration guidance](https://mui.com/material-ui/migration/upgrade-to-v6/).

Wrap your application in `FqThemeProvider` when using the default MUI integration.
Use the `tokens` prop to generate scoped CSS variables and MUI values together.
The legacy `theme` prop changes only MUI and cannot be combined with token
configuration. The default provider keeps its existing DOM and compatibility
behavior; `isolated.css` requires the explicit `enableCssLayer` prop.

## Usage

```tsx
import { Button, Input, Field, Form, FqThemeProvider } from 'fq-design-system';

function LoginForm() {
  return (
    <FqThemeProvider enableCssLayer>
      <Form onSubmit={(event) => event.preventDefault()}>
        <Field label="Email" required description="Use your work email.">
          <Input type="email" placeholder="you@company.com" />
        </Field>
        <Button type="submit">Log in</Button>
      </Form>
    </FqThemeProvider>
  );
}
```

## Components

| Component  | Description                                                                       |
| ---------- | --------------------------------------------------------------------------------- |
| `Button`   | primary, secondary, ghost, danger · sm/md/lg · loading, fullWidth, iconOnly       |
| `Checkbox` | indeterminate support · helperText, error                                         |
| `Field`    | layout wrapper — provides label, description, error, and aria context to children |
| `Form`     | semantic `<form>` wrapper with forwardRef                                         |
| `Input`    | text input · startIcon, endIcon · helperText, error                               |
| `Radio`    | radio input · helperText, error                                                   |
| `Select`   | native `<select>` · helperText, error                                             |
| `Switch`   | toggle with `role="switch"` · helperText, error                                   |
| `Textarea` | multiline input · helperText, error                                               |

Overlay naming, focus, dismissal, dark-mode corrections and verification are
documented in the [overlay accessibility guide](CONTRIBUTING.md#overlay-accessibility).

## Theming

Foundation defaults come from `src/theme/default-theme.json`; generated CSS keeps
the existing custom-property names. For a coordinated theme:

```tsx
<FqThemeProvider
  enableCssLayer
  tokens={{
    schemaVersion: 1,
    foundation: {
      palette: { '--color-blue-400': '#663399' },
      radius: { '--radius-md': '12px' },
    },
  }}
  mode="light"
  density="comfortable"
>
  <Button>Branded button</Button>
</FqThemeProvider>
```

See the [token contract](CONTRIBUTING.md#token-theme-contract) for mode selection,
validation and legacy alias precedence. The [component token reference](docs/component-tokens.md)
lists supported tokens, states, slots, density rules and examples for every family.
Provider tokens/mode/density also follow Dialog, BottomSheet and optional Snackbar
portals. See [portal scope](CONTRIBUTING.md#portal-scope) for independent brands,
container callbacks, inline defaults and clipping/SSR behavior.
CSS-only overrides remain available:

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
<html data-theme="dark"></html>
```

Or force light mode:

```html
<html data-theme="light"></html>
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

## Package and server rendering

The package is ESM: use `import`, not a CommonJS `require` integration. Public
entry points are `fq-design-system` and `fq-design-system/style.css`. Import CSS
once through your browser bundler; do not import CSS into native Node directly.
Fonts are embedded in the stylesheet, so no asset-copy step is needed.

Native Node ESM import and conventional React SSR/hydration are verified by the
clean consumer harness. For the tested SSR styling integration, opt in to the
MUI cascade layer on both server and client:

```tsx
<FqThemeProvider enableCssLayer>
  <App />
</FqThemeProvider>
```

`enableCssLayer` defaults to `false` to preserve the legacy cascade and component
dimensions. Enabling it changes specificity and can change layout; verify your
consumer theme before adopting it. Layered MUI rules cannot override the package's
unlayered CSS when Emotion moves style tags during hydration.

Render a provider tree per SSR request. The provider uses MUI's own Emotion cache
and inline server styles; an outer custom Emotion cache alone does not control
that internal cache. Advanced critical-CSS/custom-cache integrations need separate
validation. Client-only effects and portals mount in the browser. This test does
not certify React Server Components or Next.js App Router integration. See
[MUI SSR background](https://mui.com/material-ui/guides/server-rendering/) and
[package verification](verification/README.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
