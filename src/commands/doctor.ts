import path from "path";
import fs from "fs";
import { helpers } from "termost";
import pkg from "../../package.json" with { type: "json" };
import { pktsDir, projectDir } from "../util";

interface DoctorCheck {
  name: string;
  check: () => Promise<true | string>;
  fix?: () => Promise<void>;
}

export const checks: DoctorCheck[] = [
  {
    name: "package.json",
    check: async () => {
      const packageJson = path.join(projectDir, "package.json");

      if (!fs.existsSync(packageJson)) {
        return "package.json not found";
      }

      const packageJsonContent = JSON.parse(
        fs.readFileSync(packageJson, "utf-8")
      );

      const hasPebbkitDependency =
        packageJsonContent.dependencies?.[pkg.name] ||
        packageJsonContent.devDependencies?.[pkg.name];

      if (!hasPebbkitDependency) {
        return `${pkg.name} is not listed as a dependency`;
      }

      const buildScript = packageJsonContent.scripts?.build;
      if (buildScript !== "pkts build") {
        return "build script should be 'pkts build'";
      }

      return true;
    },
    fix: async () => {
      const packageJson = path.join(projectDir, "package.json");
      const packageJsonContent = JSON.parse(
        fs.readFileSync(packageJson, "utf-8")
      );

      const hasPebbkitDependency =
        packageJsonContent.dependencies?.[pkg.name] ||
        packageJsonContent.devDependencies?.[pkg.name];

      if (!hasPebbkitDependency) {
        if (!packageJsonContent.dependencies) {
          packageJsonContent.dependencies = {};
        }
        packageJsonContent.dependencies[pkg.name] = `^${pkg.version}`;
        console.log(
          helpers.format(
            `Make sure to run "npm i" before building your project!!`,
            { color: "yellow", modifiers: ["bold"] }
          )
        );
      }

      if (!packageJsonContent.scripts) {
        packageJsonContent.scripts = {};
      }
      packageJsonContent.scripts.build = "pkts build";

      fs.writeFileSync(packageJson, JSON.stringify(packageJsonContent, null, 2));
    },
  },
  {
    name: "wscript",
    check: async () => {
      const wscript = path.join(projectDir, "wscript");
      const templateWscript = path.join(pktsDir, "config/wscript");

      if (!fs.existsSync(wscript)) {
        return "wscript not found";
      }

      const userWscript = fs.readFileSync(wscript, "utf-8");
      const templateWscriptContent = fs.readFileSync(templateWscript, "utf-8");

      if (userWscript !== templateWscriptContent) {
        return "wscript does not match";
      }

      return true;
    },
    fix: async () => {
      const wscript = path.join(projectDir, "wscript");
      const templateWscript = path.join(pktsDir, "config/wscript");

      const templateContent = fs.readFileSync(templateWscript, "utf-8");
      fs.writeFileSync(wscript, templateContent);
    },
  },
  {
    name: "tsconfig.json",
    check: async () => {
      const tsConfig = path.join(projectDir, "tsconfig.json");
      const templateConfig = path.join(
        pktsDir,
        "config/tsconfig.template.json"
      );

      if (!fs.existsSync(tsConfig)) {
        return "tsconfig.json not found";
      }

      // Skip check if we don't have a config to compare against
      if (!fs.existsSync(templateConfig)) {
        return true;
      }

      try {
        const userConfig = JSON.parse(fs.readFileSync(tsConfig, "utf-8"));
        const template = JSON.parse(fs.readFileSync(templateConfig, "utf-8"));

        // Check if user config extends the correct template
        if (userConfig.extends !== template.extends) {
          return `tsconfig.json should extend "${template.extends}"`;
        }

        // Check if include array matches template
        const userInclude = JSON.stringify(userConfig.include?.sort());
        const templateInclude = JSON.stringify(template.include?.sort());

        if (userInclude !== templateInclude) {
          return `tsconfig.json include should be ${JSON.stringify(
            template.include
          )}`;
        }

        return true;
      } catch (error) {
        return "tsconfig.json is not valid JSON";
      }
    },
    fix: async () => {
      const tsConfig = path.join(projectDir, "tsconfig.json");
      const templateConfig = path.join(
        pktsDir,
        "config/tsconfig.template.json"
      );

      if (!fs.existsSync(templateConfig)) {
        throw new Error("Template config not found");
      }

      const templateContent = fs.readFileSync(templateConfig, "utf-8");
      fs.writeFileSync(tsConfig, templateContent);
    },
  },
  {
    name: "src/ts",
    check: async () => {
      const srcTs = path.join(projectDir, "src/ts");
      return fs.existsSync(srcTs) ? true : "src/ts not found";
    },
    fix: async () => {
      const srcTs = path.join(projectDir, "src/ts");
      fs.mkdirSync(srcTs, { recursive: true });
    },
  },
  {
    name: "src/ts/index.ts",
    check: async () => {
      const srcTsIndex = path.join(projectDir, "src/ts/index.ts");
      return fs.existsSync(srcTsIndex) ? true : "src/ts/index.ts not found";
    },
    fix: async () => {
      const srcTsIndex = path.join(projectDir, "src/ts/index.ts");
      fs.writeFileSync(
        srcTsIndex,
        `Pebble.addEventListener("ready", async (e) => console.log("Hello from TS!"))`
      );
    },
  },
];

export const runAllChecks = async () => {
  const results = await Promise.all(checks.map((check) => check.check()));
  return results;
};

export const doctor = async (fix: boolean) => {
  console.log(helpers.format("PebbleKit.ts Doctor", { modifiers: ["bold", "underline"] }));
  console.log("Checking for any issues\n");

  if (fix) {
    const preCheck = await runAllChecks();

    if (preCheck.some((result) => result !== true)) {
      console.log("Auto fixing issues...\n");
    }

    for (const [index, check] of checks.entries()) {
      if (preCheck[index] !== true) {
        await check?.fix();
      }
    }
  }

  const results = await runAllChecks();

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

  const failedChecks = results.filter((result) => result !== true);
  if (failedChecks.length > 0) {
    console.log(
      helpers.format(
        `\nFound ${failedChecks.length} issue${
          failedChecks.length === 1 ? "" : "s"
        }`,
        { color: "red", modifiers: ["bold"] }
      )
    );
    console.log(
      helpers.format("Please run `pkts doctor --fix` to fix them", {
        color: "yellow",
      })
    );
  }
};
