import { reply } from "../reply";

export const name = "fetchJSON";

export async function run(): Promise<void> {
  const data = await PebbleTS.fetchJSON<{ id: number; title: string }>(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  const ok = data && data.id === 1 && typeof data.title === "string";
  await reply(!!ok, `id=${data?.id} title="${data?.title}"`);
}
