Pebble.addEventListener("ready", async (e) => {
  console.log("PKJS ready, sending message");

  const watchInfo = Pebble.getActiveWatchInfo();
  console.log("Watch info: " + JSON.stringify(watchInfo));

  const [_, data] = await Promise.all([
    PebbleTS.sendAppMessage({ text: "Hello from TypeScript!" }),
    PebbleTS.fetchJSON("https://jsonplaceholder.typicode.com/posts/1"),
  ]);

  console.log("Fetched data: " + JSON.stringify(data));
});
