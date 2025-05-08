const Course = require("../models/courseModel");
const fs = require("fs");

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, price, imageUrl } = req.body;
    const lectureNotes = req.files?.lectureNotes?.map(file => file.path) || [];

    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied. Only teachers can create courses." });
    }

    if (!title || !description || !price || !imageUrl) {
      return res.status(400).json({ success: false, message: "Title, Description, Price, and Image URL are required!" });
    }

    const newCourse = new Course({
      title,
      description,
      teacher: req.user.id,
      videoUrl,
      imageUrl,
      lectureNotes,
      studentsEnrolled: [],
      status: "pending",
      price,
      rating: 0,
      reviews: [],
    });

    await newCourse.save();
    res.status(201).json({ success: true, message: "Course created successfully!", course: newCourse });
  } catch (error) {
    if (req.files?.lectureNotes) {
      req.files.lectureNotes.forEach(file => fs.unlink(file.path, () => {}));
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl, price, imageUrl } = req.body;
    const newLectureNotes = req.files?.lectureNotes?.map(file => file.path) || [];

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found!" });

    if (course.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to update this course!" });
    }

    if ((course.status === "approved" || course.status === "rejected") && req.user.role !== "admin") {
      return res.status(400).json({ success: false, message: "Cannot update an approved/rejected course!" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.videoUrl = videoUrl || course.videoUrl;
    course.price = price || course.price;
    course.imageUrl = imageUrl || course.imageUrl;

    if (newLectureNotes.length > 0) {
      course.lectureNotes.forEach(path => fs.unlink(path, () => {}));
      course.lectureNotes = newLectureNotes;
    }

    await course.save();
    res.status(200).json({ success: true, message: "Course updated successfully!", course });
  } catch (error) {
    if (req.files?.lectureNotes) {
      req.files.lectureNotes.forEach(file => fs.unlink(file.path, () => {}));
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a course (soft delete)
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found!" });

    if (course.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this course!" });
    }

    course.status = "deleted";
    await course.save();
    res.status(200).json({ success: true, message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve a course (admin only)
const approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ success: false, message: "Course not found!" });
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Only admins can approve courses" });

    course.status = "approved";
    course.rejectionReason = null;
    await course.save();

    res.status(200).json({ success: true, message: "Course approved successfully!", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a course (admin only)
const rejectCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rejectionReason } = req.body;
    if (!rejectionReason?.trim()) return res.status(400).json({ success: false, message: "Rejection reason is required." });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found!" });
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Only admins can reject courses" });

    course.status = "rejected";
    course.rejectionReason = rejectionReason;
    await course.save();

    res.status(200).json({ success: true, message: "Course rejected successfully!", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course statistics
const getCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("reviews.user", "name email")
      .populate("studentsEnrolled", "name email");

    if (!course) return res.status(404).json({ success: false, message: "Course not found!" });

    const stats = {
      totalStudents: course.studentsEnrolled.length,
      averageRating: course.reviews.length > 0
        ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
        : 0,
      numberOfReviews: course.reviews.length
    };

    res.status(200).json({
      success: true,
      ...stats,
      course: {
        id: course._id,
        title: course.title,
        status: course.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all public approved courses
const getAllPublicCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "approved" }).populate("teacher", "name");
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single public course
const getSinglePublicCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, status: "approved" }).populate("teacher", "name");

    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  approveCourse,
  rejectCourse,
  deleteCourse,
  getCourseStats,
  getAllPublicCourses,
  getSinglePublicCourse,
};
