import { reply } from "../reply";

export const name = "native fetch";

export async function run(): Promise<void> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/2");
  const text = await res.text();
  const parsed = JSON.parse(text);
  const ok = res.ok && parsed.id === 2;
  await reply(ok, `status=${res.status} id=${parsed.id}`);
}
