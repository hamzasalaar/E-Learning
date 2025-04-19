const Course = require("../models/courseModel");
const User = require("../models/userModel");

const getTeacherCourses = async (req, res) => {
  try {
    // Only allow teachers to access this route
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Teachers only." });
    }

    const teacherId = req.user.id;

    const courses = await Course.find({ teacher: teacherId })
      .sort({ createdAt: -1 }) // optional: latest courses first
      .exec();

    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    const course = await Course.findById(courseId)
      .populate("studentsEnrolled", "name email")
      .exec();

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({
      success: true,
      enrolledStudents: course.studentsEnrolled,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resubmitCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to resubmit this course!",
        });
    }

    if (course.status !== "rejected") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Only rejected courses can be resubmitted.",
        });
    }

    course.status = "pending";
    course.rejectionReason = null;

    await course.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Course resubmitted successfully!",
        course,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEnrolledStudents, getTeacherCourses, resubmitCourse };
