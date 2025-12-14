export {};

declare global {
  /**
   * The watchapp has been launched and the PebbleKit JS component is now ready to receive events.
   */
  type ReadyEvent = Event & {
    type: "ready";
  };

  /**
   * The watch sent an AppMessage to PebbleKit JS.
   * The AppMessage Dictionary is contained in the payload property (i.e: event.payload).
   * The payload consists of key-value pairs, where the keys are strings containing integers (e.g: "0"),
   * or aliases for keys defined in package.json (e.g: "KEY_EXAMPLE").
   * Values should be integers, strings or byte arrays (arrays of characters).
   */
  type AppMessageEvent = Event & {
    type: "appmessage";
    payload: Record<string, any>;
  };

  /**
   * The user has requested the app's configuration webview to be displayed.
   * This can occur either upon the app's initial install or when the user taps
   * 'Settings' in the 'My Pebble' view within the phone app.
   */
  type ShowConfigurationEvent = Event & {
    type: "showConfiguration";
  };

  interface PebbleEvents {
    ready: ReadyEvent;
    appmessage: AppMessageEvent;
    showConfiguration: ShowConfigurationEvent;
  }
}
