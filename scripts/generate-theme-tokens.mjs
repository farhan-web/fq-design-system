import { build } from 'vite';
import { format, resolveConfig } from 'prettier';
import { readFile, writeFile } from 'node:fs/promises';

// Compile the same pure TS validator/definition used by the runtime. No parallel
// token table or Node-specific JSON import syntax in the public library.
const result = await build({
  configFile: false,
  logLevel: 'silent',
  build: {
    write: false,
    lib: { entry: 'src/theme/tokenConfig.ts', formats: ['es'] },
    minify: false,
  },
});
const chunk = (Array.isArray(result) ? result[0] : result).output.find(
  (output) => output.type === 'chunk',
);
let module;
try {
  module = await import(
    `data:text/javascript;base64,${Buffer.from(chunk.code).toString('base64')}`
  );
} catch (error) {
  throw new Error(`Theme generation failed: ${error.message}`);
}
const { defaultFqThemeDefinition: definition, componentTokenTypes } = module;
const declarations = (values) =>
  Object.entries(values)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
const root = (values) => `:root {\n${declarations(values)}\n}\n`;
const header =
  '/* Generated from src/theme/default-theme.json. Run npm run tokens:generate. */\n';
const files = {
  'colors.css':
    root({ ...definition.foundation.palette, ...definition.semantic.light }) +
    `[data-theme='dark'] {\n${declarations(definition.semantic.dark)}\n}\n` +
    `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) {\n${declarations(definition.semantic.dark)}\n} }\n`,
  'spacing.css': root({
    ...definition.foundation.spacing,
    ...definition.aliases,
  }),
  'radius.css': root(definition.foundation.radius),
  'typography.css': root(definition.foundation.typography),
  'shadows.css': root(
    Object.fromEntries(
      Object.entries(definition.foundation.shadow).filter(
        ([key]) => !key.startsWith('--elevation-'),
      ),
    ),
  ),
  'elevation.css': root({
    ...Object.fromEntries(
      Object.entries(definition.foundation.shadow).filter(([key]) =>
        key.startsWith('--elevation-'),
      ),
    ),
    ...definition.foundation.layer,
  }),
};
const formatting = { ...(await resolveConfig('package.json')), parser: 'css' };
let stale = false;
for (const [name, content] of Object.entries(files)) {
  const file = `src/foundations/${name}`;
  const generated = await format(header + content, formatting);
  if (process.argv.includes('--check')) {
    if ((await readFile(file, 'utf8')) !== generated) {
      console.error(`Stale tokens: ${file}`);
      stale = true;
    }
  } else await writeFile(file, generated);
}
if (stale) throw new Error('Run npm run tokens:generate and review the diff.');
console.log(
  `${process.argv.includes('--check') ? 'Checked' : 'Generated'} six foundation stylesheets from validated theme version 1.`,
);

// JSON Schema documents structural constraints; the runtime also checks CSS
// value categories, reference types and cycles before applying a configuration.
const value = {
  type: 'string',
  minLength: 1,
  maxLength: 1024,
  pattern: String.raw`^[^;{}<>\\\u0000-\u001f]+$`,
};
const tokens = (names, includeDefaults = true) => ({
  type: 'object',
  additionalProperties: false,
  properties: Object.fromEntries(
    Object.keys(names).map((key) => [
      key,
      { ...value, ...(includeDefaults ? { default: names[key] } : {}) },
    ]),
  ),
});
const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'FQ theme configuration version 1',
  $comment:
    'Use parseFqTheme for CSS category validation and cross-token reference validation.',
  type: 'object',
  additionalProperties: false,
  required: ['schemaVersion'],
  properties: {
    schemaVersion: { const: 1 },
    foundation: {
      type: 'object',
      additionalProperties: false,
      properties: Object.fromEntries(
        Object.entries(definition.foundation).map(([key, values]) => [
          key,
          tokens(values),
        ]),
      ),
    },
    semantic: {
      type: 'object',
      additionalProperties: false,
      properties: {
        light: tokens(definition.semantic.light),
        dark: tokens({
          ...definition.semantic.light,
          ...definition.semantic.dark,
        }),
      },
    },
    aliases: tokens(definition.aliases),
    components: {
      type: 'object',
      additionalProperties: false,
      properties: Object.fromEntries(
        Object.entries(componentTokenTypes).map(([key, values]) => [
          key,
          tokens(values, false),
        ]),
      ),
    },
    density: {
      enum: ['compact', 'comfortable', 'spacious'],
      default: 'comfortable',
    },
  },
};
const schemaFile = 'src/theme/theme.schema.json';
const schemaText = await format(JSON.stringify(schema), {
  ...formatting,
  parser: 'json',
});
if (process.argv.includes('--check')) {
  if ((await readFile(schemaFile, 'utf8')) !== schemaText)
    throw new Error('Stale theme schema: run tokens:generate.');
} else await writeFile(schemaFile, schemaText);

const union = (keys) =>
  Object.keys(keys)
    .map((key) => JSON.stringify(key))
    .join(' | ');
const typesText = await format(
  `// Generated from default-theme.json. Run npm run tokens:generate.
export interface FqTokenFoundation { ${Object.entries(definition.foundation)
    .map(([key, values]) => `${key}: Record<${union(values)}, string>;`)
    .join('\n')} }
export type FqSemanticToken = ${union(definition.semantic.light)};
export type FqLegacyToken = ${union(definition.aliases)};`,
  { ...formatting, parser: 'typescript' },
);
const typesFile = 'src/theme/tokenTypes.ts';
if (process.argv.includes('--check')) {
  if ((await readFile(typesFile, 'utf8')) !== typesText)
    throw new Error('Stale token types: run tokens:generate.');
} else await writeFile(typesFile, typesText);
