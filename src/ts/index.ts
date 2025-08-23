Pebble.addEventListener("ready", async (e) => {
  console.log("PKJS ready, sending message");

  await PebbleTS.sendAppMessage({ text: "Hello from TypeScript!" });

  console.log("Message sent");
});
