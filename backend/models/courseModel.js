const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true,
        },
        videoUrl: { type: String },
        lectureNotes: { type: String },
        studentsEnrolled: [
            { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
        ],
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "approved", "rejected"],
        },
        price: { type: Number, required: true, min: 0 },
        rating: { type: Number, default: 0 },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String, required: false },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
