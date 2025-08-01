export function sendMessage(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    Pebble.sendAppMessage(
      { text },
      () => resolve(),
      (e) => {
        console.log("Message failed: " + JSON.stringify(e));
        reject(e);
      }
    );
  });
}
