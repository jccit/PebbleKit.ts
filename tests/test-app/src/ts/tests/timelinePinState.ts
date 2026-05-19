export const PIN_ID = "pkts-test-pin-1";

let lastInsertedPinId: string | null = null;

export function setLastInsertedPinId(id: string): void {
  lastInsertedPinId = id;
}

export function getLastInsertedPinId(): string | null {
  return lastInsertedPinId;
}
