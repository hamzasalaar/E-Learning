const Course = require("../models/courseModel");
const User = require("../models/userModel");

// Get all courses for the logged-in teacher
const getTeacherCourses = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied. Teachers only." });
    }

    const teacherId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");

    const sortBy = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const filter = {
      teacher: teacherId,
      title: { $regex: searchRegex },
    };

    const totalCourses = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      success: true,
      courses,
      currentPage: page,
      totalPages,
      totalCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get students enrolled in a specific course
const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    const course = await Course.findById(courseId).populate("studentsEnrolled", "name email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.teacher.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
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
      return res.status(404).json({ success: false, message: "Course not found!" });
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

    const course = await Course.findById(courseId).populate("studentsEnrolled", "name email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeacherCourses,
  getEnrolledStudents,
  resubmitCourse,
  getSingleCourse, // ✅ include here
};
