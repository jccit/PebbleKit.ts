import { sendMessage } from "./message";

Pebble.addEventListener("ready", async (e) => {
  console.log("PKJS ready, sending message");

  await sendMessage("Hello from TypeScript!");

  console.log("Message sent");
});
