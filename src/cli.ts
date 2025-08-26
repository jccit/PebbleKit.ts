import pkg from "../package.json" with { type: "json" };
import { termost } from "termost";
import { doctor } from "./commands/doctor";
import { build } from "./commands/build";

const program = termost({
  name: "pkts",
  description: "Typescript tools for Pebble",
  version: pkg.version,
});

program
  .command<{ _internalNoop: void }>({
    name: "doctor",
    description: "Checks your Pebble project for issues with your PKTS setup",
  })
  .task({
    handler: doctor,
  });

program
  .command<{ _internalNoop: void }>({
    name: "build",
    description: "Compiles Typescript into valid PKJS",
  })
  .task({
    handler: build,
  });
