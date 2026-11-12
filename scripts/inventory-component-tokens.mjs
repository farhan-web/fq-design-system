import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';

async function main() {
  const root = path.resolve(
    process.argv.find((a) => a.startsWith('--root='))?.slice(7) ?? '.',
  );
  const report = process.argv.find((a) => a.startsWith('--report='))?.slice(9);
  const source = ts.createSourceFile(
    'componentTokens.ts',
    await readFile(path.join(root, 'src/theme/componentTokens.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  let expression;
  function find(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(source) === 'componentTokenTypes'
    )
      expression = node.initializer.expression;
    ts.forEachChild(node, find);
  }
  find(source);
  assert(
    expression && ts.isObjectLiteralExpression(expression),
    'Expected a literal component registry',
  );
  const registry = Object.fromEntries(
    expression.properties.map((group) => [
      group.name.text,
      Object.fromEntries(
        group.initializer.properties.map((token) => [
          token.name.text,
          token.initializer.text,
        ]),
      ),
    ]),
  );
  const registered = new Set(
    Object.values(registry).flatMap((group) => Object.keys(group)),
  );
  const used = new Set();
  const structural = new Set([
    '--fq-density-padding',
    '--fq-density-gap',
    '--fq-icon-size',
  ]);
  const families = [];

  // A literal color is compatible only inside an actual var() fallback, not merely
  // somewhere in a declaration that also happens to contain another variable.
  function literalColors(value) {
    const stack = [],
      colors = [];
    for (let i = 0; i < value.length; i++) {
      const hex = /^#[\da-f]{3,8}\b/i.exec(value.slice(i));
      if (hex) {
        colors.push({
          value: hex[0],
          fallback: stack.some((f) => f.name === 'var' && f.comma),
        });
        i += hex[0].length - 1;
        continue;
      }
      if (value[i] === '(') {
        const name = /([\w-]+)$/.exec(value.slice(0, i))?.[1] ?? '';
        if (/^rgba?$/.test(name))
          colors.push({
            value: name + '()',
            fallback: stack.some((f) => f.name === 'var' && f.comma),
          });
        stack.push({ name, comma: false });
      } else if (value[i] === ')') stack.pop();
      else if (value[i] === ',' && stack.length) stack.at(-1).comma = true;
    }
    return colors;
  }
  for (const family of (
    await readdir(path.join(root, 'src/components'), { withFileTypes: true })
  )
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()) {
    const directory = path.join(root, 'src/components', family);
    const files = (await readdir(directory)).filter((f) => f.endsWith('.css'));
    const group = family[0].toLowerCase() + family.slice(1);
    const row = {
      family,
      group,
      tokens: registry[group] ?? {},
      density: [],
      retainedMetrics: [],
      compatibilityColors: [],
    };
    for (const file of files) {
      const css = postcss.parse(
        await readFile(path.join(directory, file), 'utf8'),
      );
      css.walkDecls((decl) => {
        for (const match of decl.value.matchAll(/var\(\s*(--fq-[\w-]+)/g)) {
          assert(
            registered.has(match[1]) || structural.has(match[1]),
            `${family}: unregistered component token ${match[1]}`,
          );
          used.add(match[1]);
        }
        for (const color of literalColors(decl.value)) {
          assert(
            color.fallback,
            `${family}: active literal color ${color.value} in ${decl.parent.selector} ${decl.prop}`,
          );
          row.compatibilityColors.push({
            selector: decl.parent.selector,
            property: decl.prop,
            value: decl.value,
          });
        }
        if (/(?:padding|gap)-scale/.test(decl.value))
          row.density.push({
            selector: decl.parent.selector,
            property: decl.prop,
          });
        const withoutNames = decl.value.replace(/--[\w-]+/g, 'token');
        if (/\b\d/.test(withoutNames))
          row.retainedMetrics.push({
            selector: decl.parent.selector,
            property: decl.prop,
            value: decl.value,
            reason: /(?:padding|gap)-scale/.test(decl.value)
              ? 'bounded density; exact comfortable fallback'
              : literalColors(decl.value).length
                ? 'compatibility fallback'
                : /^(font|line-height)/.test(decl.prop)
                  ? 'retained font metric'
                  : /^(transition|animation|transform|opacity)/.test(decl.prop)
                    ? 'state/motion contract'
                    : 'structural geometry or zero layout value',
          });
      });
    }
    row.density = [
      ...new Set(row.density.map((d) => `${d.selector}: ${d.property}`)),
    ];
    if (!files.length)
      row.exemption =
        'Unstyled native/context container; existing native/slot props and host inheritance.';
    families.push(row);
  }
  for (const token of registered)
    assert(used.has(token), `Registered token has no CSS consumer: ${token}`);
  const result = {
    schemaVersion: 1,
    familyCount: families.length,
    componentGroups: Object.keys(registry).length,
    tokenCount: registered.size,
    structuralVariables: [...structural],
    families,
  };
  if (report) {
    const file = path.resolve(root, report);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(result, null, 2) + '\n');
  }
  console.log(
    `Component token inventory: ${families.length} families, ${Object.keys(registry).length} groups, ${registered.size} consumed tokens; no active literal colors or dangling aliases.`,
  );
}
await main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
