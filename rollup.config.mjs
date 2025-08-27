import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "src/cli.ts",
  output: {
    file: "bin/pkts.js",
    banner: "#!/usr/bin/env node",
  },
  plugins: [typescript(), json()],
  external: [
    "termost",
    "path",
    "fs",
    "url",
    "@rollup/plugin-typescript",
    "@rollup/plugin-node-resolve",
    "@rollup/plugin-babel",
    "@rollup/plugin-commonjs",
    "@rollup/plugin-terser",
    "@rollup/plugin-inject",
    "@rollup/plugin-json",
    "rollup",
  ],
};
