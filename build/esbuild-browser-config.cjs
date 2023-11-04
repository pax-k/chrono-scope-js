/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('esbuild').BuildOptions} */
module.exports = {
  entryPoints: ["./src/index.js"],
  bundle: true,
  format: "esm",
  sourcemap: true,
  minify: true,
  platform: "neutral",
  target: ["chrome101", "firefox108", "safari16"],
  inject: [require.resolve("node-stdlib-browser/helpers/esbuild/shim")],
  define: {
    global: "globalThis",
  },
};
