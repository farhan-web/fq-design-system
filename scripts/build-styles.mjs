import postcss from 'postcss';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

export const layerOrder = 'reset, mui, fq-tokens, fq';
const resetSelectors = [
  new Set(['*']),
  new Set(['html', 'body', '#root']),
  new Set(['body']),
];
function isReset(rule) {
  const selectors = new Set(rule.selectors.map((selector) => selector.trim()));
  return resetSelectors.some(
    (known) =>
      known.size === selectors.size &&
      [...known].every((selector) => selectors.has(selector)),
  );
}
function tokenBlock(node) {
  let declarations = 0;
  let tokens = true;
  node.walkDecls((declaration) => {
    declarations += 1;
    if (!declaration.prop.startsWith('--')) tokens = false;
  });
  return declarations > 0 && tokens;
}
/** Preserve the legacy file and derive opt-in entries from the built CSS graph. */
export function isolatedStyles(css, baseCss = '') {
  const source = postcss.parse(css);
  source.walkDecls((declaration) => {
    if (declaration.important)
      throw new Error('Library styles must not use !important');
  });
  const isolated = postcss.root();
  const reset = postcss.root();
  const foundationLayer = postcss.atRule({
    name: 'layer',
    params: 'fq-tokens',
  });
  const componentLayer = postcss.atRule({ name: 'layer', params: 'fq' });
  const resetLayer = postcss.atRule({ name: 'layer', params: 'reset' });
  isolated.append(
    postcss.atRule({ name: 'layer', params: layerOrder }),
    foundationLayer,
    componentLayer,
  );
  reset.append(
    postcss.atRule({ name: 'layer', params: layerOrder }),
    resetLayer,
  );
  componentLayer.append(postcss.parse(baseCss).nodes);
  let resetCount = 0;
  for (const node of source.nodes) {
    if (
      node.type === 'comment' ||
      (node.type === 'atrule' && node.name === 'layer' && !node.nodes)
    )
      continue;
    if (node.type === 'rule' && isReset(node)) {
      resetLayer.append(node.clone());
      resetCount += 1;
      continue;
    }
    if (
      (node.type === 'atrule' && node.name === 'font-face') ||
      tokenBlock(node)
    )
      foundationLayer.append(node.clone());
    else componentLayer.append(node.clone());
  }
  if (resetCount !== 3)
    throw new Error(
      `Expected exactly three legacy reset blocks, got ${resetCount}; review CSS extraction.`,
    );
  componentLayer.walkDecls((declaration) => {
    if (declaration.important)
      throw new Error('Library styles must not use !important');
  });
  componentLayer.walkRules((rule) => {
    if (rule.parent.type === 'atrule' && rule.parent.name.endsWith('keyframes'))
      return;
    if (!rule.selectors.every((selector) => selector.includes('fq-')))
      throw new Error(`Unscoped rule in isolated CSS: ${rule.selector}`);
  });
  return { isolated: isolated.toString(), reset: reset.toString() };
}
if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  const css = await readFile('dist/fq-design-system.css', 'utf8');
  const baseCss = await readFile('src/isolated-base.css', 'utf8');
  const result = isolatedStyles(css, baseCss);
  await writeFile('dist/fq-design-system.isolated.css', result.isolated);
  await writeFile('dist/fq-design-system.reset.css', result.reset);
  console.log(
    'Built layered isolated CSS and opt-in reset; legacy stylesheet retained.',
  );
}
