import { reply } from "../reply";
import { SERVER } from "./serverUrl";

export const name = "native fetch";

export async function run(): Promise<void> {
  const res = await fetch(`${SERVER}/json`);
  const text = await res.text();
  const parsed = JSON.parse(text);
  const ok = res.ok && parsed.id === 1;
  await reply(ok, `status=${res.status} id=${parsed.id}`);
}
