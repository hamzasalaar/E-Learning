const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLectures: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      required: true,
    },
    completedLectureIds: [
      { type: mongoose.Schema.Types.ObjectId, required: true },
    ],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Optional: unique progress entry per student+course
progressSchema.index({ student: 1, course: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
