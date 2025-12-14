export {};

declare global {
  namespace Pebble {
    interface PebbleKitJS {
      /**
       * Adds a listener for PebbleKit JS events, such as when an AppMessage is received or the configuration view is opened or closed.
       * @param event - The event to listen for (see PebbleEvents)
       * @param callback - The callback to call when the event is received
       */
      addEventListener<T extends keyof PebbleEvents>(
        event: T,
        callback: (e: PebbleEvents[T]) => void
      ): void;

      /**
       * Remove an existing event listener previously registered with Pebble.addEventListener()
       * @param event - The event to remove the listener for (see PebbleEvents)
       * @param callback - The callback to remove
       */
      removeEventListener<T extends keyof PebbleEvents>(
        event: T,
        callback: (e: PebbleEvents[T]) => void
      ): void;

      /**
       * Send an AppMessage to the watchapp.
       *
       * @deprecated Use PebbleTS.sendAppMessage() instead
       * @param message - The message object to send
       * @param successCallback - The callback to call when the message is sent
       * @param errorCallback - The callback to call when the message fails to send
       */
      sendAppMessage(
        message: Record<string, any>,
        successCallback: (e: any) => void,
        errorCallback: (e: any) => void
      ): void;

      /**
       * Get the user's timeline token for this app.
       * @deprecated Use PebbleTS.getTimelineToken() instead
       * @param successCallback - The callback to call when the token is received
       * @param errorCallback - The callback to call when the token fails to be received
       */
      getTimelineToken(
        successCallback: (e: string) => void,
        errorCallback: () => void
      ): void;

      showSimpleNotificationOnPebble(title: string, body: string): void;

      /**
       * When an app is marked as configurable, the PebbleKit JS component must implement Pebble.openURL() in the showConfiguration event handler.
       * The Pebble mobile app will launch the supplied URL to allow the user to configure the watchapp or watchface.
       */
      openURL(url: string): void;

      /**
       * Obtain an object containing information on the currently connected Pebble smartwatch.
       */
      getActiveWatchInfo(): WatchInfo;

      /**
       * Returns a unique account token that is associated with the Pebble account of the current user.
       */
      getAccountToken(): string;

      /**
       * Returns a a unique token that can be used to identify a Pebble device.
       */
      getWatchToken(): string;

      /**
       * Adds a timeline pin to the user's timeline.
       * Only exists on the Core Devices app.
       * @param pin - TimelinePin object or string
       */
      insertTimelinePin?: (pin: TimelinePin | string) => void;

      /**
       * Deletes a pin from the user's timeline by id
       * Only exists on the Core Devices app.
       * @param id - The ID of the timeline pin to remove
       */
      deleteTimelinePin?: (id: string) => void;
    }
  }

  const Pebble: Pebble.PebbleKitJS;

  const PebbleTS: typeof import("../index").default;
}
