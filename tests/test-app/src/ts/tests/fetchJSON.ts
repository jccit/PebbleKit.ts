import { reply } from "../reply";
import { SERVER } from "./serverUrl";

export const name = "fetchJSON";

export async function run(): Promise<void> {
  const data = await PebbleTS.fetchJSON<{ id: number; title: string }>(
    `${SERVER}/json`,
  );
  const ok = data && data.id === 1 && typeof data.title === "string";
  await reply(!!ok, `id=${data?.id} title="${data?.title}"`);
}
