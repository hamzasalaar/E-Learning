const CourseModel = require("../models/courseModel");
const UserModel = require("../models/userModel");

const publicCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({ status: "approved" })
      .populate("teacher", "name email")
      .sort({ rating: -1 }) // show top-rated
      .limit(6);

    const uniqueTeacherIds = [
      ...new Set(courses.map((course) => course.teacher._id.toString())),
    ];

    const tutors = await UserModel.find({
      _id: { $in: uniqueTeacherIds },
      role: "teacher",
    }).select("name email role"); // add profile picture if available

    res.status(200).json({ success: true, courses, tutors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  publicCourses,
};