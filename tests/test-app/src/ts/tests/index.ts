import * as sendAppMessage from "./sendAppMessage";
import * as fetchJSON from "./fetchJSON";
import * as nativeFetch from "./nativeFetch";
import * as fetchString from "./fetchString";
import * as fetchBinary from "./fetchBinary";
import * as getTimelineToken from "./getTimelineToken";
import * as insertTimelinePin from "./insertTimelinePin";
import * as deleteTimelinePin from "./deleteTimelinePin";

export interface Test {
  name: string;
  run: () => Promise<void>;
}

const allTests: Test[] = [
  sendAppMessage,
  fetchJSON,
  nativeFetch,
  fetchString,
  fetchBinary,
  getTimelineToken,
  insertTimelinePin,
  deleteTimelinePin,
];

export const TESTS: Record<string, () => Promise<void>> = Object.fromEntries(
  allTests.map((t) => [t.name, t.run])
);
