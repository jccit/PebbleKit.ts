// Fixture responses served by test-server.mjs. Add or edit entries here when
// a test needs a different payload. Each entry maps a path to a response.
//
// body may be:
//   - a string  → sent as-is
//   - an object → JSON.stringify'd, content-type defaults to application/json
//   - a Uint8Array / Buffer → sent as bytes

export const PAYLOADS = {
  "/string": {
    status: 200,
    body: "Hello world",
  },
  "/json": {
    status: 200,
    body: { id: 1, title: "json body", obj: { arr: [1, 2, "3"] } },
  },
  "/binary": {
    status: 200,
    contentType: "application/octet-stream",
    body: new Uint8Array([9, 8, 7, 6, 5, 5, 4, 3, 2, 1]),
  },
};
