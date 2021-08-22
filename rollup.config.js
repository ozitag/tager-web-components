import path from 'path';

import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as fs from 'fs-extra';
import url from '@rollup/plugin-url';
import { default as svgr } from '@svgr/rollup';

const external = (id) => !id.startsWith('.') && !path.isAbsolute(id);

const resolveApp = function (relativePath) {
  return path.resolve(relativePath);
};

const distName = 'dist';
const distPath = resolveApp(distName);

const packageName = 'web-components';

async function cleanDistFolder() {
  await fs.remove(distPath);
}

function getOutputName(options) {
  const fileName = [
    packageName,
    options.format,
    options.env,
    options.minify ? 'min' : '',
    'js',
  ]
    .filter(Boolean)
    .join('.');

  if (options.absolute) {
    return path.join(distPath, fileName);
  }

  return fileName;
}

const cjsProdFileName = getOutputName({
  format: 'cjs',
  env: 'production',
  minify: true,
});
const cjsDevFileName = getOutputName({ format: 'cjs', env: 'development' });

function writeCjsEntryFile() {
  const contents = `'use strict'
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${cjsProdFileName}')
} else {
  module.exports = require('./${cjsDevFileName}')
}
`;
  return fs.outputFile(path.join(distPath, 'index.js'), contents);
}

function createRollupConfig(options) {
  const minify = options.env === 'production' && options.format !== 'esm';

  return {
    input: 'src/main.tsx',
    output: {
      file: getOutputName({ ...options, minify, absolute: true }),
      format: options.format,
    },
    plugins: [
      nodeResolve(),
      url({ emitFiles: false }),
      svgr({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      esbuild({ minify }),
    ],
    external: (id) => {
      const packagesToIncludeInBundle = [];
      if (packagesToIncludeInBundle.includes(id)) {
        return false;
      }

      return external(id);
    },
  };
}

export default async function () {
  await cleanDistFolder();
  await writeCjsEntryFile();

  return [
    createRollupConfig({ format: 'cjs', env: 'development' }),
    createRollupConfig({ format: 'cjs', env: 'production' }),
    createRollupConfig({ format: 'esm' }),
  ];
}
