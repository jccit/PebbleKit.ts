import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "src/cli.ts",
  output: {
    file: "bin/pkts.js",
    banner: "#!/usr/bin/env node",
  },
  plugins: [typescript(), json()],
  external: ["termost", "path", "fs"],
};
