import { reply } from "../reply";
import { SERVER } from "./serverUrl";

export const name = "fetchBinary";

export async function run(): Promise<void> {
  const bytes = await PebbleTS.fetchBinary(`${SERVER}/binary`);
  const ok =
    bytes instanceof Uint8Array &&
    bytes.length > 0 &&
    bytes[0] === 9 &&
    bytes[1] === 8;
  await reply(ok, `bytes=${bytes.length}`);
}
