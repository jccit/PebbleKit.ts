import { reply } from "../reply";

export const name = "sendAppMessage";

export async function run(): Promise<void> {
  await reply(true, "round-trip ok");
}
