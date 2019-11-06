"use strict";

const R = require("ramda");
const babelTransform = require("@babel/core").transform;
const rollup = require("rollup").rollup;
const rollupCommonjs = require("rollup-plugin-commonjs");

const BabelPluginExportToFunction = require("./BabelPluginExportToFunction");
const bundle = require("./bundle");
const buildLiteralAst = require("./buildLiteralAst");

const dependencies = {
  rollup,
  babelTransform,
  BabelPluginExportToFunction,
  buildLiteralAst,
  rollupCommonjs,
};

const nodeVersionsSupportedByAuth0 = [4, 8];

const defaultNodeVersion = 4;

module.exports = function createBundler({
  nodeVersion = defaultNodeVersion,
  plugins = a => a,
} = {}) {
  if (!nodeVersionsSupportedByAuth0.includes(nodeVersion)) {
    const message =
      `Unsupported node version ${nodeVersion}, ` +
      `only one of the following versions are supported: ${nodeVersionsSupportedByAuth0.join(
        ", "
      )}`;

    throw new Error(message);
  }

  return {
    bundleScript: R.partial(bundle, [
      dependencies,
      { commonjs: false, nodeVersion, plugins },
    ]),
    bundleRule: R.partial(bundle, [
      dependencies,
      { commonjs: false, nodeVersion, plugins },
    ]),
    bundleHook: R.partial(bundle, [
      dependencies,
      { commonjs: true, nodeVersion, plugins },
    ]),
  };
};

// kept for backwards compatibility
module.exports.bundleScript = R.partial(bundle, [
  dependencies,
  { commonjs: false, nodeVersion: defaultNodeVersion },
]);
module.exports.bundleRule = R.partial(bundle, [
  dependencies,
  { commonjs: false, nodeVersion: defaultNodeVersion },
]);
module.exports.bundleHook = R.partial(bundle, [
  dependencies,
  { commonjs: true, nodeVersion: defaultNodeVersion },
]);
