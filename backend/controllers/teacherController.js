const Course = require("../models/courseModel");
const User = require("../models/userModel");
const bbb = require("../utils/bbb"); // Assuming you have a bbb.js file for BigBlueButton API
const LiveSession = require("../models/liveSessionModel"); // Assuming you have a LiveSession model

// Get all courses for the logged-in teacher
const getTeacherCourses = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Teachers only." });
    }

    const teacherId = req.user.id;

    const courses = await Course.find({ teacher: teacherId });
    
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    const course = await Course.findById(courseId).populate(
      "studentsEnrolled",
      "name email"
    );

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

// Resubmit a rejected course
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
      return res.status(403).json({
        success: false,
        message: "You are not authorized to resubmit this course!",
      });
    }

    if (course.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Only rejected courses can be resubmitted.",
      });
    }

    course.status = "pending";
    course.rejectionReason = null;

    await course.save();
    res.status(200).json({
      success: true,
      message: "Course resubmitted successfully!",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Get single course details
const getSingleCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate(
      "studentsEnrolled reviews.user",
      "name email"
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access." });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the logged-in teacher's profile
const getTeacherProfile = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Teachers only." });
    }

    const teacher = await User.findById(req.user.id).select("-password -__v");

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update the teacher's profile
const updateTeacherProfile = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Teachers only." });
    }

    const { name, profilePicture } = req.body;

    const teacher = await User.findById(req.user.id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    if (name) teacher.name = name;
    if (profilePicture) teacher.imageUrl = profilePicture;

    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeacherCourses,
  getEnrolledStudents,
  resubmitCourse,
  getSingleCourse,
  getTeacherProfile,
  updateTeacherProfile,
};
