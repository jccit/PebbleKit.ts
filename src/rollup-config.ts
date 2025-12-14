import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import path from "path";
import { pktsDir } from "./util";

export default {
  input: "src/ts/index.ts",
  output: {
    file: "src/ts-build/index.js",
    format: "iife",
    compact: true,
  },
  plugins: [
    typescript(),
    nodeResolve({
      extensions: [".ts", ".js"],
    }),
    commonjs(),
    json(),
    babel({
      babelHelpers: "inline",
      extensions: [".ts", ".js"],
      configFile: path.join(pktsDir, "config/babel.config.json"),
    }),
    terser(),
  ],
};
