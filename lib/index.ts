import { sendAppMessage } from "./appMessage";
import {
  getTimelineToken,
  insertTimelinePin,
  deleteTimelinePin,
} from "./timeline";
import { fetchString, fetchJSON, fetchBinary } from "./fetch";

export default {
  sendAppMessage,
  getTimelineToken,
  insertTimelinePin,
  deleteTimelinePin,
  fetchString,
  fetchJSON,
  fetchBinary,
};
