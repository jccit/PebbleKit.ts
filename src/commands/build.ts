import { OutputOptions, rollup, RollupOptions } from "rollup";
import inject from "@rollup/plugin-inject";
import path from "path";
import rollupConfig from "../rollup-config";
import { projectDir, pktsDir } from "../util";
import { helpers } from "termost";

export const build = async () => {
  console.log("Building PKTS project...");

  const outputOptions: OutputOptions = {
    file: path.join(projectDir, rollupConfig.output.file),
    format: "iife",
    compact: true,
  };

  const completeConfig: RollupOptions = {
    ...rollupConfig,
    input: path.join(projectDir, rollupConfig.input),
    output: outputOptions,
    plugins: [
      inject({
        PebbleTS: path.join(pktsDir, "lib/index.ts"),
      }),
      ...rollupConfig.plugins,
    ],
    onwarn: (warning) => {
      console.log(
        helpers.format("WARNING", { color: "yellow", modifiers: ["bold"] })
      );
      console.log(warning.frame + warning.message);
    },
  };

  console.log(
    helpers.format(
      `Compiling ${rollupConfig.input} -> ${rollupConfig.output.file}`,
      { color: "green", modifiers: ["bold"] }
    )
  );

  try {
    const bundle = await rollup(completeConfig);
    await bundle.write(outputOptions);

    await bundle.close();
  } catch (error) {
    console.error(helpers.format(error.message, { color: "red" }));
    process.exit(1);
  }
};
