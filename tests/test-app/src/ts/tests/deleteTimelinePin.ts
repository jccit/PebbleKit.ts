import { reply } from "../reply";
import { PIN_ID, getLastInsertedPinId } from "./timelinePinState";

export const name = "deleteTimelinePin";

export async function run(): Promise<void> {
  const id = getLastInsertedPinId() ?? PIN_ID;
  PebbleTS.deleteTimelinePin(id);
  await reply(true, `deleted id=${id}`);
}
