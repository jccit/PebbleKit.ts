import { reply } from "../reply";

export const name = "getTimelineToken";

export async function run(): Promise<void> {
  const token = await PebbleTS.getTimelineToken();
  const ok = typeof token === "string" && token.length > 0;
  await reply(ok, `token=${token.slice(0, 12)}...`);
}
