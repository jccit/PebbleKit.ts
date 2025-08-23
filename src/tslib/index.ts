/**
 * PebbleTS public API
 * @packageDocumentation
 * @module PebbleTS
 */
import { sendAppMessage } from "./appMessage";
import { getTimelineToken } from "./timeline";
import { fetchString, fetchJSON, fetchBinary } from "./fetch";

export { sendAppMessage } from "./appMessage";
export { getTimelineToken } from "./timeline";
export { fetchString, fetchJSON, fetchBinary } from "./fetch";

/** @internal */
export default {
  sendAppMessage,
  getTimelineToken,
  fetchString,
  fetchJSON,
  fetchBinary,
};
