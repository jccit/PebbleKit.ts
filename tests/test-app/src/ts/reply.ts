export async function reply(pass: boolean, result: string): Promise<void> {
  const trimmed = result.length > 200 ? result.slice(0, 197) + "..." : result;
  console.log(`[TEST_RESULT] ${pass ? "PASS" : "FAIL"}: ${trimmed}`);
  try {
    await PebbleTS.sendAppMessage({ status: pass ? 1 : 0, result: trimmed });
  } catch (err) {
    console.log(`Failed to send reply: ${JSON.stringify(err)}`);
  }
}
