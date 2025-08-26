import { helpers } from "termost";
import { checks, runAllChecks } from "./doctor";

export const init = async () => {
  console.log(
    helpers.format("PebbleKit.ts Installer\n", {
      modifiers: ["underline"],
    })
  );

  const checkResults = await runAllChecks();

  const allChecksPassed = checkResults.every((result) => result === true);

  if (allChecksPassed) {
    console.log(
      helpers.format(
        "❌ Project already has PebbleKit.ts installed. Skipping.",
        { color: "red", modifiers: ["bold"] }
      )
    );
    process.exit(1);
  }

  // To init we basically just fix any issues we've found with doctor
  for (const check of checks) {
    await check?.fix?.();
  }

  console.log(
    helpers.format("\n🎉 PebbleKit.ts installed!", {
      color: "green",
      modifiers: ["bold"],
    })
  );
  console.log(
    "Add your TypeScript code to 'src/ts/index.ts', then run 'pebble build' to build your project!"
  );
};
