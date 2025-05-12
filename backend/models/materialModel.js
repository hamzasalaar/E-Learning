const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["lecture", "video", "reading", "assignment", "quiz"],
      required: true,
    },
    filePaths: [String], // for uploaded files
    url: String, // for external links like YouTube
    dueDate: Date,
    instructions: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
