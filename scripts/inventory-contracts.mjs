import { format, resolveConfig } from 'prettier';
import ts from 'typescript';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const components = [];
for (const name of (await readdir('src/components')).sort()) {
  const directory = path.join('src/components', name);
  const files = await readdir(directory);
  const contracts = [];
  for (const filename of files.filter(
    (file) => file.endsWith('.tsx') && !/\.(test|stories)\./.test(file),
  )) {
    const source = await readFile(path.join(directory, filename), 'utf8');
    const ast = ts.createSourceFile(
      filename,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    for (const node of ast.statements) {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        )
      )
        contracts.push(node.getText(ast));
    }
  }
  const storyFile = files.find((file) => file.endsWith('.stories.tsx'));
  const stories = storyFile
    ? [
        ...(await readFile(path.join(directory, storyFile), 'utf8')).matchAll(
          /export const (\w+)/g,
        ),
      ].map((match) => match[1])
    : [];
  components.push({
    name,
    directory,
    contracts,
    stories,
    tests: await Promise.all(
      files
        .filter((file) => /\.test\.tsx?$/.test(file))
        .map(async (file) => ({
          file,
          cases: [
            ...(await readFile(path.join(directory, file), 'utf8')).matchAll(
              /(?:it|test)\(\s*['"]([^'"]+)['"]/g,
            ),
          ].map((match) => match[1]),
        })),
    ),
  });
}
const tokens = {};
for (const file of (await readdir('src/foundations')).filter((file) =>
  file.endsWith('.css'),
))
  tokens[file] = [
    ...new Set(
      [
        ...(
          await readFile(path.join('src/foundations', file), 'utf8')
        ).matchAll(/(--[\w-]+)\s*:/g),
      ].map((match) => match[1]),
    ),
  ];
await mkdir('verification', { recursive: true });
await writeFile(
  'verification/inventory.json',
  await format(
    JSON.stringify(
      {
        publicEntry: await readFile('src/index.ts', 'utf8'),
        components,
        tokens,
      },
      null,
      2,
    ),
    { ...(await resolveConfig('package.json')), parser: 'json' },
  ),
);
console.log(
  `Inventoried ${components.length} component families, public declarations, stories, tests and foundation tokens.`,
);
