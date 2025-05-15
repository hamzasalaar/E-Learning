const axios = require("axios");
const crypto = require("crypto");
const qs = require("querystring");

const BBB_URL = "https://test-install.blindsidenetworks.com/bigbluebutton/";
const SECRET = "8cd8ef52e8e101574e400365b55e11a6";

function buildBBBUrl(apiCall, params = {}) {
  const query = qs.stringify(params);
  const checksum = crypto
    .createHash("sha1")
    .update(apiCall + query + SECRET)
    .digest("hex");

  return `${BBB_URL}api/${apiCall}?${query}&checksum=${checksum}`;
}

function createMeeting({
  meetingID,
  name,
  duration = 60,
  attendeePW = "ap",
  moderatorPW = "mp",
  record = false,
  autoStartRecording = false,
  allowStartStopRecording = false,
}) {
  const url = buildBBBUrl("create", {
    meetingID,
    name,
    duration,
    attendeePW,
    moderatorPW,
    record: record ? "true" : "false",
    autoStartRecording: autoStartRecording ? "true" : "false",
    allowStartStopRecording: allowStartStopRecording ? "true" : "false",
  });
  return url;
}

function joinMeeting({ meetingID, fullName, password }) {
  const url = buildBBBUrl("join", {
    meetingID,
    fullName,
    password,
  });
  return url;
}

function getRecordingsUrl({ meetingID }) {
  const query = `meetingID=${meetingID}`;
  const checksum = crypto
    .createHash("sha1")
    .update("getRecordings" + query + SECRET)
    .digest("hex");

  return `${BBB_URL}api/getRecordings?${query}&checksum=${checksum}`;
}

module.exports = {
  createMeeting,
  joinMeeting,
  getRecordingsUrl,
};
