// models/LiveSession.js
const mongoose = require("mongoose");

const liveSessionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    meetingID: {
      type: String,
      required: true,
      unique: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // in minutes
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // should be a teacher
      required: true,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    willBeRecorded: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveSession", liveSessionSchema);
