import { test } from 'node:test';
import assert from 'node:assert/strict';
import postcss from 'postcss';
import { isolatedStyles } from '../build-styles.mjs';
const css =
  ':root{--color-primary:#123456}*{box-sizing:border-box}html,body,#root{margin:0;min-height:100%}body{font-family:var(--font-family)}.fq-button{padding:12px}@keyframes fq-spin{from{opacity:0}to{opacity:1}}';
test('isolated styles contain actual layers and keep global reset opt-in', () => {
  const result = isolatedStyles(css);
  const isolated = postcss.parse(result.isolated);
  assert(
    isolated.nodes.every(
      (node) => node.type === 'atrule' && node.name === 'layer',
    ),
  );
  const components = isolated.nodes.find((node) => node.params === 'fq');
  assert(components.toString().includes('.fq-button'));
  assert(!result.isolated.includes('body{font-family'));
  assert(result.reset.includes('body{font-family'));
  assert(result.reset.includes('@layer reset'));
});
test('stylesheet extraction rejects global leaks, important declarations and missing reset blocks', () => {
  assert.throws(() => isolatedStyles(css + 'button{padding:0}'), /Unscoped/);
  assert.throws(
    () => isolatedStyles(css + '.fq-button,button{color:red}'),
    /Unscoped/,
  );
  assert.throws(
    () => isolatedStyles(css + '.fq-button{color:red!important}'),
    /important/,
  );
  assert.throws(
    () => isolatedStyles('.fq-button{color:red}'),
    /three legacy reset/,
  );
  assert.throws(
    () => isolatedStyles(css, '.fq-button{color:red!important}'),
    /important/,
  );
});
