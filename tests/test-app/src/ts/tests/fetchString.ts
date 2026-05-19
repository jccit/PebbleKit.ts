import { reply } from "../reply";
import { SERVER } from "./serverUrl";

export const name = "fetchString";

export async function run(): Promise<void> {
  const str = await PebbleTS.fetchString(`${SERVER}/string`);
  const ok = typeof str === "string" && str === "Hello world";
  await reply(ok, `len=${str.length}`);
}
