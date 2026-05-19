// Local HTTP server used by the test app. Serves fixtures defined in
// test-payloads.mjs. Started/stopped by run-tests.mjs; can also be run
// standalone (`node test-server.mjs`) for manual emulator debugging.

import { createServer } from "node:http";
import { PAYLOADS } from "./test-payloads.mjs";

export const TEST_SERVER_PORT = 9753;

function encodeBody(entry) {
  const { body } = entry;
  if (body instanceof Uint8Array) {
    return {
      buf: Buffer.from(body),
      contentType: entry.contentType ?? "application/octet-stream",
    };
  }
  if (Buffer.isBuffer(body)) {
    return {
      buf: body,
      contentType: entry.contentType ?? "application/octet-stream",
    };
  }
  if (typeof body === "string") {
    return {
      buf: Buffer.from(body),
      contentType: entry.contentType ?? "text/plain; charset=utf-8",
    };
  }
  return {
    buf: Buffer.from(JSON.stringify(body)),
    contentType: entry.contentType ?? "application/json; charset=utf-8",
  };
}

export function startTestServer(port = TEST_SERVER_PORT) {
  const server = createServer((req, res) => {
    const path = (req.url ?? "").split("?")[0];
    const entry = PAYLOADS[path];
    if (!entry) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end(`no fixture for ${path}`);
      return;
    }
    const { buf, contentType } = encodeBody(entry);
    res.writeHead(entry.status ?? 200, {
      "content-type": contentType,
      "content-length": buf.length,
    });
    res.end(buf);
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      console.log(`test server listening on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startTestServer().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
