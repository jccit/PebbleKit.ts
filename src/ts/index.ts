Pebble.addEventListener("ready", async (e) => {
  console.log("PKJS ready, sending message");

  const watchInfo = Pebble.getActiveWatchInfo();

  console.log("Watch info: " + JSON.stringify(watchInfo));

  await PebbleTS.sendAppMessage({ text: "Hello from TypeScript!" });

  console.log("Message sent");
});
