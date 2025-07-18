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
    imageUrl: { type: String, required: true },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected", "deleted"],
    },
    rejectionReason: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", CourseSchema);

module.exports = CourseModel;
