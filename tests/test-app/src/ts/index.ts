// PKTS test harness. The C side sends `run_test` with a test name string; we
// look up the matching runner and reply with `status` (1=pass, 0=fail) and a
// `result` string.

import { reply } from "./reply";
import { TESTS } from "./tests";

let queue: Promise<void> = Promise.resolve();

Pebble.addEventListener("ready", () => {
  console.log("PKTS test harness ready");
  const info = Pebble.getActiveWatchInfo();
  console.log(`Watch: ${JSON.stringify(info)}`);
  console.log(`Account token: ${Pebble.getAccountToken()}`);
  console.log(`Watch token: ${Pebble.getWatchToken()}`);
});

Pebble.addEventListener("appmessage", (e) => {
  const payload = e.payload as { run_test?: string };
  const name = payload.run_test;
  if (typeof name !== "string") return;
  queue = queue.then(() => handleRunTest(name));
});

async function handleRunTest(name: string): Promise<void> {
  console.log(`[TEST_START] ${name}`);

  const runner = TESTS[name];
  if (!runner) {
    await reply(false, `unknown test "${name}"`);
    console.log(`[TEST_END] ${name}`);
    return;
  }

  try {
    await runner();
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    console.log(`threw: ${msg}`);
    await reply(false, `threw: ${msg}`);
  }
  console.log(`[TEST_END] ${name}`);
}
