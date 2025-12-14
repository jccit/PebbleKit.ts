/**
 * Get the user's timeline token for this app.
 * @returns A promise that resolves with the token, rejects on failure with error
 */
export function getTimelineToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    Pebble.getTimelineToken(resolve, reject);
  });
}

/**
 * Adds a timeline pin to the user's timeline.
 * Only works on the Core Devices app. This function will throw when not available.
 * @param pin - TimelinePin object or string
 * @throws Error if insertTimelinePin is not available
 */
export function insertTimelinePin(pin: TimelinePin | string): void {
  if (!Pebble.insertTimelinePin) {
    throw new Error("insertTimelinePin is not available");
  }
  Pebble.insertTimelinePin(pin);
}

/**
 * Deletes a pin from the user's timeline by id.
 * Only works on the Core Devices app. This function will throw when not available.
 * @param id - The ID of the timeline pin to remove
 * @throws Error if removeTimelinePin is not available
 */
export function deleteTimelinePin(id: string): void {
  if (!Pebble.deleteTimelinePin) {
    throw new Error("deleteTimelinePin is not available");
  }
  Pebble.deleteTimelinePin(id);
}
