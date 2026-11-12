import defaults from './default-theme.json';

export type FqThemeMode = 'light' | 'dark';
export type FqDensity = 'compact' | 'comfortable' | 'spacious';
import type {
  FqTokenFoundation,
  FqSemanticToken,
  FqLegacyToken,
} from './tokenTypes';
type Foundation = FqTokenFoundation;
import { requiredSemanticTokens } from './requiredSemanticTokens';
type RequiredSemanticToken = (typeof requiredSemanticTokens)[number];
type Semantic = Record<RequiredSemanticToken, string> &
  Partial<Record<Exclude<FqSemanticToken, RequiredSemanticToken>, string>>;
import { componentTokenTypes } from './componentTokens';
export { componentTokenTypes } from './componentTokens';
type ComponentOverrides = {
  [K in keyof typeof componentTokenTypes]: Partial<
    Record<keyof (typeof componentTokenTypes)[K], string>
  >;
};
// Keep version-1 definitions containing only the original two groups assignable.
type Components = Pick<ComponentOverrides, 'button' | 'input'> &
  Partial<Omit<ComponentOverrides, 'button' | 'input'>>;
export interface FqThemeConfig {
  schemaVersion: 1;
  foundation?: { [K in keyof Foundation]?: Partial<Foundation[K]> };
  semantic?: { light?: Partial<Semantic>; dark?: Partial<Semantic> };
  aliases?: Partial<Record<FqLegacyToken, string>>;
  components?: Partial<Components>;
  density?: FqDensity;
}
export interface FqThemeDefinition {
  schemaVersion: 1;
  foundation: Foundation;
  semantic: { light: Semantic; dark: Partial<Semantic> };
  aliases: Record<FqLegacyToken, string>;
  components: Components;
  density: FqDensity;
}
export class FqThemeValidationError extends Error {
  readonly path: string;
  constructor(path: string, detail: string) {
    super(`${path}: ${detail}`);
    this.name = 'FqThemeValidationError';
    this.path = path;
  }
}
function fail(path: string, detail: string): never {
  throw new FqThemeValidationError(path, detail);
}
function object(value: unknown, path: string): Record<string, unknown> {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  )
    fail(path, 'expected a JSON object');
  return value as Record<string, unknown>;
}
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
const length = /^(?:0|(?:\d+(?:\.\d+)?)(?:px|rem|em|%))$/;
const reference = /^var\((--[\w-]+)\)$/;
function validateValue(
  value: unknown,
  type: string,
  path: string,
): asserts value is string {
  if (
    typeof value !== 'string' ||
    value.length > 1024 ||
    /[;{}<>\\]|url\s*\(|@/i.test(value) ||
    Array.from(value).some((character) => character.charCodeAt(0) < 32)
  )
    fail(path, 'expected a safe CSS token string');
  if (reference.test(value)) return;
  if (type === 'color') {
    if (/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value))
      return;
    const rgb =
      /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*(\d+(?:\.\d+)?)%)?\s*\)$/.exec(
        value,
      );
    if (
      rgb &&
      rgb.slice(1, 4).every((v) => Number(v) <= 255) &&
      (!rgb[4] || Number(rgb[4]) <= 100)
    )
      return;
    const commaRgb =
      /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?|\.\d+))?\s*\)$/.exec(
        value,
      );
    if (commaRgb && commaRgb.slice(1, 4).every((v) => Number(v) <= 255)) return;
    if (
      /^color-mix\(\s*in srgb,\s*(?:var\(--[\w-]+\)|#[\da-f]{6}) (?:\d|[1-9]\d|100)%,\s*transparent\s*\)$/i.test(
        value,
      )
    )
      return;
    fail(
      path,
      'expected hex, rgb(r g b / a%), a token reference or supported color-mix',
    );
  }
  if (
    type === 'length' &&
    length.test(value) &&
    Number.parseFloat(value) <= 1000000
  )
    return;
  if (
    type === 'density' &&
    /^(?:0|1)(?:\.\d+)?$/.test(value) &&
    Number(value) >= 0.75 &&
    Number(value) <= 1.25
  )
    return;
  if (type === 'radius' && /^(?:0|\d+(?:\.\d+)?px)$/.test(value)) return;
  if (type === 'integer' && /^\d+$/.test(value) && Number(value) <= 1000000000)
    return;
  if (
    type === 'weight' &&
    /^\d+$/.test(value) &&
    Number(value) >= 1 &&
    Number(value) <= 1000
  )
    return;
  if (
    type === 'number' &&
    /^\d+(?:\.\d+)?$/.test(value) &&
    Number(value) <= 10000
  )
    return;
  if (
    type === 'font' &&
    value
      .split(',')
      .every((name) =>
        /^(?:[a-zA-Z_-][\w -]*|'[^']+'|"[^"]+")$/.test(name.trim()),
      )
  )
    return;
  if (type === 'shadow') {
    if (value === 'none') return;
    const parts = value.split(/,(?![^()]*\))/);
    for (const part of parts) {
      const parsed = /^((?:-?\d+(?:\.\d+)?(?:px|rem|em)?\s+){2,4})(.+)$/.exec(
        part.trim(),
      );
      if (!parsed) fail(path, 'invalid shadow value');
      const lengths = parsed[1].trim().split(/\s+/);
      if (
        !lengths.every((length) =>
          /^(?:0|-?\d+(?:\.\d+)?(?:px|rem|em))$/.test(length),
        ) ||
        (lengths.length >= 3 && parseFloat(lengths[2]) < 0)
      )
        fail(path, 'invalid shadow lengths');
      validateValue(parsed[2], 'color', path);
    }
    return;
  }
  fail(path, `invalid ${type} value`);
}
function tokenType(group: string, key: string): string {
  if (group === 'palette' || group === 'semantic') return 'color';
  if (group === 'layer') return 'integer';
  if (group === 'radius') return 'radius';
  if (group === 'shadow') return 'shadow';
  if (group === 'typography') {
    if (key === '--font-family') return 'font';
    if (key.includes('weight')) return 'weight';
    if (key.startsWith('--line-height-')) return 'number';
    if (key.startsWith('--font-size-')) return 'radius';
  }
  return 'length';
}
function mergeTokens(
  target: Record<string, string>,
  patch: unknown,
  allowed: Record<string, unknown>,
  group: string,
  path: string,
) {
  for (const [key, value] of Object.entries(object(patch, path))) {
    if (!Object.hasOwn(allowed, key)) fail(`${path}.${key}`, 'unknown token');
    validateValue(
      value,
      group === 'component' ? String(allowed[key]) : tokenType(group, key),
      `${path}.${key}`,
    );
    target[key] = value;
  }
}
/** Validate and merge before changing any active theme; no DOM or MUI dependencies. */
export function parseFqTheme(
  input: unknown = { schemaVersion: 1 },
): FqThemeDefinition {
  if (defaults.schemaVersion !== 1)
    fail('defaults.schemaVersion', 'expected version 1');
  const fields = [
    'schemaVersion',
    'foundation',
    'semantic',
    'aliases',
    'components',
    'density',
  ];
  for (const key of Object.keys(defaults))
    if (!fields.includes(key)) fail(`defaults.${key}`, 'unknown field');
  for (const name of requiredSemanticTokens) {
    if (!Object.hasOwn(defaults.semantic.light, name))
      fail(
        'defaults.semantic.light.' + name,
        'missing required version-1 role',
      );
  }
  const patch = object(input, 'theme');
  for (const key of Object.keys(patch))
    if (!fields.includes(key)) fail(`theme.${key}`, 'unknown field');
  if (patch.schemaVersion !== 1)
    fail('theme.schemaVersion', 'expected version 1');
  for (const group of Object.keys(defaults.components)) {
    if (!Object.hasOwn(componentTokenTypes, group))
      fail(`defaults.components.${group}`, 'unknown component group');
  }
  const result = structuredClone(defaults) as FqThemeDefinition;
  if (patch.foundation !== undefined)
    for (const [group, values] of Object.entries(
      object(patch.foundation, 'theme.foundation'),
    )) {
      if (!Object.hasOwn(result.foundation, group))
        fail(`theme.foundation.${group}`, 'unknown group');
      const key = group as keyof Foundation;
      mergeTokens(
        result.foundation[key],
        values,
        defaults.foundation[key],
        group,
        `theme.foundation.${group}`,
      );
    }
  if (patch.semantic !== undefined)
    for (const [mode, values] of Object.entries(
      object(patch.semantic, 'theme.semantic'),
    )) {
      if (mode !== 'light' && mode !== 'dark')
        fail(`theme.semantic.${mode}`, 'expected light or dark');
      mergeTokens(
        result.semantic[mode],
        values,
        defaults.semantic.light,
        'semantic',
        `theme.semantic.${mode}`,
      );
    }
  if (patch.aliases !== undefined)
    mergeTokens(
      result.aliases,
      patch.aliases,
      defaults.aliases,
      'spacing',
      'theme.aliases',
    );
  if (patch.components !== undefined)
    for (const [group, values] of Object.entries(
      object(patch.components, 'theme.components'),
    )) {
      if (!Object.hasOwn(componentTokenTypes, group))
        fail(`theme.components.${group}`, 'unknown component group');
      const key = group as keyof Components;
      const target = result.components[key];
      if (!target)
        fail(`defaults.components.${group}`, 'missing component group');
      mergeTokens(
        target,
        values,
        componentTokenTypes[key],
        'component',
        `theme.components.${group}`,
      );
    }
  if (patch.density !== undefined) {
    if (!['compact', 'comfortable', 'spacious'].includes(String(patch.density)))
      fail('theme.density', 'expected compact, comfortable or spacious');
    result.density = patch.density as FqDensity;
  }
  // Resolve both modes to reject missing references, category mismatches and cycles.
  for (const mode of ['light', 'dark'] as const) {
    const variables = flatten(result, mode);
    for (const name of Object.keys(variables)) resolveToken(variables, name);
    for (const [group, values] of Object.entries(result.foundation))
      for (const name of Object.keys(values))
        validateValue(
          resolveToken(variables, name),
          tokenType(group, name),
          `theme.foundation.${group}.${name}`,
        );
    for (const name of Object.keys(result.aliases))
      validateValue(
        resolveToken(variables, name),
        'length',
        `theme.aliases.${name}`,
      );
    for (const name of Object.keys(result.semantic.light))
      validateValue(
        resolveToken(variables, name),
        'color',
        `theme.semantic.${mode}.${name}`,
      );
    for (const [group, values] of Object.entries(result.components))
      for (const name of Object.keys(values))
        validateValue(
          resolveToken(variables, name),
          componentTokenTypes[group as keyof Components][name as never],
          `theme.components.${group}.${name}`,
        );
  }
  return freeze(result);
}
export function parseFqThemeJson(json: string): FqThemeDefinition {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return fail('theme', 'invalid JSON');
  }
  return parseFqTheme(value);
}
export const defaultFqThemeDefinition = parseFqTheme();
export const densityScales: Readonly<
  Record<FqDensity, { padding: string; gap: string }>
> = freeze({
  compact: { padding: '0.75', gap: '0.75' },
  comfortable: { padding: '1', gap: '1' },
  spacious: { padding: '1.25', gap: '1.25' },
});
function flatten(
  definition: FqThemeDefinition,
  mode: FqThemeMode,
): Record<string, string> {
  return Object.assign(
    {},
    ...Object.values(definition.foundation),
    definition.semantic.light,
    mode === 'dark' ? definition.semantic.dark : {},
    definition.aliases,
    ...Object.values(definition.components),
  );
}
/** Legacy alias overrides are last; a direct legacy declaration wins for its consumers. */
export function themeCssVariables(
  input: FqThemeConfig | FqThemeDefinition = { schemaVersion: 1 },
  mode: FqThemeMode = 'light',
  density?: FqDensity,
): Record<string, string> {
  if (mode !== 'light' && mode !== 'dark')
    fail('mode', 'expected light or dark');
  const definition = parseFqTheme(input);
  const selected = density ?? definition.density;
  if (!Object.hasOwn(densityScales, selected))
    fail('density', 'unknown density');
  return {
    ...flatten(definition, mode),
    '--fq-density-padding': densityScales[selected].padding,
    '--fq-density-gap': densityScales[selected].gap,
  };
}
export function resolveToken(
  variables: Record<string, string>,
  name: string,
  trail: string[] = [],
): string {
  if (trail.includes(name))
    fail(name, `cyclic reference: ${[...trail, name].join(' → ')}`);
  if (!Object.hasOwn(variables, name)) fail(name, 'unknown token reference');
  return variables[name].replace(/var\((--[\w-]+)\)/g, (_match, ref: string) =>
    resolveToken(variables, ref, [...trail, name]),
  );
}
