const Course = require("../models/courseModel");
const LiveSession = require("../models/liveSessionModel");
const bbb = require("../utils/bbb"); // Our manual BigBlueButton utility
const axios = require("axios");
const xm12js = require("xml2js");

// Create a live session
const createLiveSession = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, startTime, duration } = req.body;

    const course = await Course.findById(courseId);
    if (!course || course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const meetingID = `course_${courseId}_${Date.now()}`;

    const createUrl = bbb.createMeeting({
      meetingID,
      name: title,
      duration,
      attendeePW: "ap",
      moderatorPW: "mp",
      record: true,
      autoStartRecording: false,
      allowStartStopRecording: true, //  Moderator can stop it manually
    });

    await axios.get(createUrl); // Call the API to create the meeting

    const session = await LiveSession.create({
      course: courseId,
      title,
      description,
      meetingID,
      startTime,
      duration,
      createdBy: req.user._id,
      isLive: true,
    });

    res.status(201).json({ success: true, session, url: createUrl });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create live session." });
  }
};

// Student joins a session
const joinLiveSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await LiveSession.findById(sessionId).populate("course");

    if (!session)
      return res.status(404).json({ message: "Session not found." });

    const isEnrolled = session.course.studentsEnrolled.includes(req.user._id);
    if (!isEnrolled) {
      return res.status(403).json({ message: "Not enrolled in this course." });
    }

    const joinUrl = bbb.joinMeeting({
      meetingID: session.meetingID,
      fullName: req.user.name,
      password: "ap",
    });

    res.json({ success: true, url: joinUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Join failed." });
  }
};

// Teacher joins as moderator
const moderatorJoinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await LiveSession.findById(sessionId);

    if (!session || session.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to join as moderator." });
    }

    const joinUrl = bbb.joinMeeting({
      meetingID: session.meetingID,
      fullName: req.user.name,
      password: "mp",
    });

    res.json({ success: true, url: joinUrl });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to join as moderator." });
  }
};

// Get all sessions for a course
const getLiveSessionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (
      !course ||
      (req.user.role === "student" &&
        !course.studentsEnrolled.includes(req.user._id)) ||
      (req.user.role === "teacher" &&
        course.teacher.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access Denied." });
    }

    const sessions = await LiveSession.find({ course: courseId })
      .sort({ startTime: -1 })
      .populate("course", "title");

    res.json({ success: true, sessions });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error loading sessions." });
  }
};

// Cancel a session
const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await LiveSession.findById(sessionId);

    if (!session || session.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    await LiveSession.findByIdAndDelete(sessionId);
    res.json({ success: true, message: "Session cancelled." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel session." });
  }
};

// Placeholder for checking if session is running (complex XML parsing needed)
const isSessionRunning = async (req, res) => {
  try {
    return res
      .status(501)
      .json({ message: "Meeting status check not implemented." });
  } catch (err) {
    res.status(500).json({ message: "Error checking meeting status." });
  }
};

const getRecordings = async (req, res) => {
  try {
    const { meetingID } = req.params;
    const recordingsUrl = bbb.getRecordingsUrl({ meetingID });

    const response = await axios.get(recordingsUrl);
    const xml = response.data;

    const parsed = await xm12js.parseStringPromise(xml, {
      explicitArray: false,
    });
    const recordings = parsed.response.recordings?.recording || [];

    const formatted = Array.isArray(recordings) ? recordings : [recordings];

    const data = formatted.map((rec) => ({
      recordID: rec.recordID,
      meetingID: rec.meetingID,
      startTime: new Date(Number(rec.startTime)).toLocaleString(),
      endTime: new Date(Number(rec.endTime)).toLocaleString(),
      playbackUrl: rec.playback?.format?.url,
      published: rec.published === "true",
    }));

    res.json({ success: true, recordings: data });
  } catch (err) {
    console.error("Recording fetch error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recordings" });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await LiveSession.findByIdAndDelete(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    res.json({ success: true, message: "Session deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete session" });
  }
};

module.exports = {
  createLiveSession,
  joinLiveSession,
  moderatorJoinSession,
  getLiveSessionsByCourse,
  cancelSession,
  isSessionRunning,
  getRecordings,
  deleteSession,
};
