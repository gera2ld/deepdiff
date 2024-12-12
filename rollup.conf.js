import { defineExternal, definePlugins } from '@gera2ld/plaid-rollup';
import { defineConfig } from 'rollup';
import pkg from './package.json' with { type: 'json' };

const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License */`;

const external = defineExternal(
  Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }),
);

export default defineConfig([
  {
    input: 'src/index.ts',
    plugins: definePlugins({
      esm: true,
      minimize: false,
    }),
    external,
    output: {
      format: 'esm',
      file: `dist/index.mjs`,
      banner,
    },
  },
  {
    input: 'src/index.ts',
    plugins: definePlugins({
      esm: true,
      minimize: false,
    }),
    external,
    output: {
      format: 'cjs',
      file: `dist/index.js`,
      banner,
    },
  },
]);
