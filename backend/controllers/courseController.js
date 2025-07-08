const Course = require("../models/courseModel");
const fs = require("fs");

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, price } = req.body;
    let imageUrl = req.body.imageUrl; // fallback in case no file uploaded

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only teachers can create courses.",
      });
    }

    if (!title || !description || !price || (!imageUrl && !req.file)) {
      return res.status(400).json({
        success: false,
        message: "Title, Description, Price, and Image are required!",
      });
    }

    if (req.file) {
      imageUrl = `/uploads/courseImages/${req.file.filename}`;
    }

    const newCourse = new Course({
      title,
      description,
      teacher: req.user.id,
      videoUrl,
      imageUrl,
      studentsEnrolled: [],
      status: "pending",
      price,
      rating: 0,
      reviews: [],
      materials: [],
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully!",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update a course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl, price, imageUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });

    if (
      course.teacher.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this course!",
      });
    }

    if (req.file) {
      course.imageUrl = `/uploads/courseImages/${req.file.filename}`;
    } else {
      course.imageUrl = imageUrl || course.imageUrl;
    }

    // if ((course.status === "approved" || course.status === "rejected") && req.user.role !== "admin") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Cannot update an approved/rejected course!",
    //   });
    // }

    if (title !== undefined && title.trim() !== "") course.title = title;
    if (description !== undefined && description.trim() !== "")
      course.description = description;
    if (videoUrl !== undefined && videoUrl.trim() !== "")
      course.videoUrl = videoUrl;
    if (price !== undefined && price !== "") course.price = price;
    if (req.file)
      course.imageUrl = `/uploads/courseImages/${req.file.filename}`;

    await course.save();
    res
      .status(200)
      .json({ success: true, message: "Course updated successfully!", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a course (soft delete)
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });

    if (
      course.teacher.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this course!",
      });
    }

    course.status = "deleted";
    await course.save();
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve a course (admin only)
const approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Only admins can approve courses" });

    course.status = "approved";
    course.rejectionReason = null;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course approved successfully!",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a course (admin only)
const rejectCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rejectionReason } = req.body;
    if (!rejectionReason?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Rejection reason is required." });

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Only admins can reject courses" });

    course.status = "rejected";
    course.rejectionReason = rejectionReason;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course rejected successfully!",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course statistics
const getCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("reviews.user", "name email") // populate review authors
      .populate("studentsEnrolled", "name email") // optional if needed
      .populate("teacher", "name email"); // optional if needed

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    // Avoid divide by 0 error
    const totalReviews = course.reviews.length;
    const averageRating =
      totalReviews > 0
        ? course.reviews.reduce((acc, review) => acc + review.rating, 0) /
          totalReviews
        : 0;

    const formattedReviews = course.reviews.map((review) => ({
      _id: review._id,
      studentName: review.user?.name || "Anonymous",
      studentEmail: review.user?.email || "",
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));

    res.status(200).json({
      success: true,
      courseId: course._id,
      title: course.title,
      totalStudents: course.studentsEnrolled.length,
      price: course.price,
      averageRating,
      numberOfReviews: totalReviews,
      reviews: formattedReviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all public approved courses
const getAllPublicCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "approved" }).populate(
      "teacher",
      "name"
    );
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single public course
const getSinglePublicCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({
      _id: courseId,
      status: "approved",
    }).populate("teacher", "name");

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
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
