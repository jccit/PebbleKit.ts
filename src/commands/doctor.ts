import path from "path";
import fs from "fs";
import { helpers } from "termost";
import { projectDir } from "../util";

interface DoctorCheck {
  name: string;
  check: () => Promise<true | string>;
}

const checks: DoctorCheck[] = [
  {
    name: "tsconfig.json",
    check: async () => {
      const tsConfig = path.join(projectDir, "tsconfig.json");
      return fs.existsSync(tsConfig) ? true : "tsconfig.json not found";
    },
  },
  {
    name: "src/ts",
    check: async () => {
      const srcTs = path.join(projectDir, "src/ts");
      return fs.existsSync(srcTs) ? true : "src/ts not found";
    },
  },
  {
    name: "src/ts/index.ts",
    check: async () => {
      const srcTsIndex = path.join(projectDir, "src/ts/index.ts");
      return fs.existsSync(srcTsIndex) ? true : "src/ts/index.ts not found";
    },
  },
];

export const doctor = async () => {
  console.log(helpers.format("PebbleKit.ts Doctor", { modifiers: ["bold"] }));
  console.log("Checking for any issues\n");

  const results = await Promise.all(checks.map((check) => check.check()));

  for (const [index, check] of checks.entries()) {
    const result = results[index];
    const passed = result === true;

    console.log(
      helpers.format(
        `${passed ? "✅" : "❌"} ${check.name} - ${
          passed ? "passed" : `FAILED: ${result}`
        }`,
        {
          color: passed ? "green" : "red",
          modifiers: passed ? [] : ["bold"],
        }
      )
    );
  }
};
