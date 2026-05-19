import { reply } from "../reply";

export const name = "fetchString";

export async function run(): Promise<void> {
  const str = await PebbleTS.fetchString(
    "https://jsonplaceholder.typicode.com/posts/3"
  );
  const ok = typeof str === "string" && str.includes('"id"');
  await reply(ok, `len=${str.length}`);
}
