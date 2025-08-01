import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/ts/index.ts",
  output: {
    file: "src/pkjs/index.js",
    format: "iife",
    compact: true,
  },
  plugins: [
    typescript(),
    nodeResolve(),
    babel({ babelHelpers: "inline", extensions: [".ts", ".js"] }),
  ],
};
