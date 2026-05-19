#!/usr/bin/env node
import { spawn } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startTestServer } from "./test-server.mjs";

const PLATFORM = "emery";
const HERE = dirname(fileURLToPath(import.meta.url));
const OVERALL_TIMEOUT_MS = 5 * 60 * 1000;

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function run(cmd, args, opts = {}) {
  return new Promise((resolveP, rejectP) => {
    const child = spawn(cmd, args, { stdio: "inherit", cwd: HERE, ...opts });
    child.on("error", rejectP);
    child.on("exit", (code) => {
      if (code === 0) resolveP();
      else rejectP(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

async function main() {
  console.log(`${BOLD}==> Starting local test server${RESET}`);
  const testServer = await startTestServer();

  console.log(`${BOLD}==> Kill and wipe emulator${RESET}`);
  await run("pebble", ["kill"]);
  await run("pebble", ["wipe"]);

  console.log(`${BOLD}==> Build test app${RESET}`);
  await run("pebble", ["build"]);

  console.log(`${BOLD}==> Installing on ${PLATFORM}${RESET}`);
  await run("pebble", ["install", "--emulator", PLATFORM]);

  console.log(`${BOLD}==> Tailing logs${RESET}`);
  const logs = spawn("pebble", ["logs", "--emulator", PLATFORM], {
    cwd: HERE,
    stdio: ["ignore", "pipe", "pipe"],
  });

  /** @type {{name: string, status: "PASS"|"FAIL", body: string, output: string[]}[]} */
  const tests = [];
  let current = null;
  let reportDone = false;

  const overallTimeout = setTimeout(() => {
    console.error(
      `${RED}Overall timeout after ${OVERALL_TIMEOUT_MS}ms${RESET}`,
    );
    finish(2);
  }, OVERALL_TIMEOUT_MS);

  let exitCode = -1;
  function finish(code) {
    if (exitCode !== -1) return;
    exitCode = code;
    clearTimeout(overallTimeout);
    try {
      logs.kill("SIGTERM");
    } catch {}
    try {
      testServer.close();
    } catch {}
    // Backstop: if `pebble kill` hangs or errors, exit anyway after 5s.
    const backstop = setTimeout(() => {
      printSummary();
      process.exit(exitCode);
    }, 5000).unref();
    const killer = spawn("pebble", ["kill"], { stdio: "ignore" });
    const done = () => {
      clearTimeout(backstop);
      printSummary();
      process.exit(exitCode);
    };
    killer.on("exit", done);
    killer.on("error", done);
  }

  function printSummary() {
    console.log("");
    console.log(
      `${BOLD}==================== RESULTS ====================${RESET}`,
    );
    for (const t of tests) {
      const tag =
        t.status === "PASS"
          ? `${GREEN}PASS${RESET}`
          : `${RED}${t.status}${RESET}`;
      console.log(
        `${tag}  ${t.name}${t.body ? `  ${DIM}${t.body}${RESET}` : ""}`,
      );
      if (t.status !== "PASS" && t.output.length) {
        for (const line of t.output) console.log(`   ${DIM}${line}${RESET}`);
      }
    }
    const passes = tests.filter((t) => t.status === "PASS").length;
    const fails = tests.length - passes;
    console.log(
      `${BOLD}=================================================${RESET}`,
    );
    console.log(
      `${BOLD}${passes} passed, ${fails} failed, ${tests.length} total${RESET}`,
    );
  }

  // Pebble logs prefix lines with e.g. "[HH:MM:SS] pkjs> " or "[HH:MM:SS] runner.c:71> ".
  function stripPrefix(line) {
    const i = line.indexOf("> ");
    return i === -1 ? line : line.slice(i + 2);
  }

  function handleLine(rawLine) {
    const line = rawLine.replace(/\r$/, "");
    if (!line) return;
    const msg = stripPrefix(line);

    let m;
    if ((m = msg.match(/\[TEST_START\]\s+(.*)$/))) {
      current = {
        name: m[1],
        status: "FAIL",
        body: "(no result received)",
        output: [],
      };
      tests.push(current);
      return;
    }
    if ((m = msg.match(/\[TEST_RESULT\]\s+(PASS|FAIL):\s*(.*)$/))) {
      if (current) {
        current.status = m[1];
        current.body = m[2];
      }
      return;
    }
    if (/\[TEST_END\]\s+/.test(msg)) {
      current = null;
      return;
    }
    if (msg.includes("[REPORT_DONE]")) {
      reportDone = true;
      finish(tests.some((t) => t.status !== "PASS") ? 1 : 0);
      return;
    }

    if (current) {
      current.output.push(msg);
    }
  }

  let buf = "";
  logs.stdout.on("data", (chunk) => {
    buf += chunk.toString();
    let i;
    while ((i = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, i);
      buf = buf.slice(i + 1);
      // Mirror raw logs at low contrast so the user can see liveness.
      process.stdout.write(`${DIM}${line}${RESET}\n`);
      handleLine(line);
    }
  });
  logs.stderr.on("data", (chunk) => process.stderr.write(chunk));
  logs.on("exit", () => {
    if (!reportDone) {
      console.error(`${RED}pebble logs exited before [REPORT_DONE]${RESET}`);
      finish(2);
    }
  });

  // Give pkjs a moment to settle, then trigger TEST ALL (SELECT on row 0).
  await new Promise((r) => setTimeout(r, 2000));
  console.log(`${BOLD}==> pressing SELECT to start TEST ALL${RESET}`);
  await run("pebble", [
    "emu-button",
    "--emulator",
    PLATFORM,
    "click",
    "select",
  ]);
}

main().catch((err) => {
  console.error(`${RED}${err.stack || err.message || err}${RESET}`);
  spawn("pebble", ["kill"], { stdio: "ignore" }).on("exit", () =>
    process.exit(2),
  );
});
