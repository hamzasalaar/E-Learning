const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: { type: String },
    lectureNotes: { type: String },
    lectures: [
      {
        title: { type: String, required: true },
        videoUrl: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    rejectionReason: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", CourseSchema);

module.exports = CourseModel;
