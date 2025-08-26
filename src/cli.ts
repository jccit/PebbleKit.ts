import pkg from "../package.json" with { type: "json" };
import { termost } from "termost";
import { doctor } from "./commands/doctor";
import { build } from "./commands/build";
import { init } from "./commands/init";

const program = termost({
  name: "pkts",
  description: "Typescript tools for Pebble",
  version: pkg.version,
});

program
  .command<{ _internalNoop: void }>({
    name: "init",
    description: "Initializes a new PebbleKit.ts project",
  })
  .task({
    handler: init,
  });

program
  .command<{ _internalNoop: void }>({
    name: "build",
    description: "Compiles Typescript into valid PKJS",
  })
  .task({
    handler: build,
  });


program
  .command<{ fix: boolean }>({
    name: "doctor",
    description: "Checks your Pebble project for issues with your PKTS setup",
  })
  .option({
    key: "fix",
    name: "fix",
    description: "Fixes any issues found if possible",
    defaultValue: false,
  })
  .task({
    async handler(args) {
      await doctor(args.fix);
    },
  });