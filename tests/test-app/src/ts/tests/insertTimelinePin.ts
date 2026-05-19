import { reply } from "../reply";
import { PIN_ID, setLastInsertedPinId } from "./timelinePinState";

export const name = "insertTimelinePin";

export async function run(): Promise<void> {
  const pin: TimelinePin = {
    id: PIN_ID,
    time: new Date(Date.now() + 60 * 60 * 1000),
    duration: 10,
    layout: {
      type: "genericPin",
      title: "PKTS test pin",
      tinyIcon: "system://images/NOTIFICATION_FLAG",
      subtitle: "Inserted by test app",
      body: "If you can see this in the timeline, insertTimelinePin works.",
    },
  };
  PebbleTS.insertTimelinePin(pin);
  setLastInsertedPinId(PIN_ID);
  await reply(true, `inserted id=${PIN_ID}`);
}
