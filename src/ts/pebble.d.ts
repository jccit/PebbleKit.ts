interface PebbleKitJS {
  addEventListener<T extends keyof PebbleEvents>(
    event: T,
    callback: (e: PebbleEvents[T]) => void
  ): void;

  removeEventListener<T extends keyof PebbleEvents>(
    event: T,
    callback: (e: PebbleEvents[T]) => void
  ): void;

  sendAppMessage(
    message: Record<string, any>,
    successCallback: (e: any) => void,
    errorCallback: (e: any) => void
  ): void;

  getTimelineToken(
    successCallback: (e: any) => void,
    errorCallback: (e: any) => void
  ): void;

  showSimpleNotificationOnPebble(title: string, body: string): void;
}

type ReadyEvent = Event & {
  type: "ready";
};

type AppMessageEvent = Event & {
  type: "appmessage";
  payload: Record<string, any>;
};

interface PebbleEvents {
  ready: ReadyEvent;
  appmessage: AppMessageEvent;
}

declare global {
  var Pebble: PebbleKitJS;
}

export {};
