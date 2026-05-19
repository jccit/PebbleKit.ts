import { reply } from "../reply";

export const name = "fetchBinary";

export async function run(): Promise<void> {
  const bytes = await PebbleTS.fetchBinary(
    "https://jsonplaceholder.typicode.com/posts/4"
  );
  const ok = bytes instanceof Uint8Array && bytes.length > 0;
  await reply(ok, `bytes=${bytes.length}`);
}
