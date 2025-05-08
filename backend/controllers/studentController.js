const Course = require("../models/courseModel");
const Progress = require("../models/progressModel");
const User = require("../models/userModel");

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",})
      }
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    // Prevent enrolling in rejected or pending courses
    if (course.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "You can only enroll in approved courses!",
      });
    }

    // Check if student is already enrolled
    if (course.studentsEnrolled.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course!",
      });
    }

    // Enroll the student
    course.studentsEnrolled.push(studentId);
    await course.save();

    const progress = new Progress({
      student: studentId,
      course: courseId,
      completed: false,
      progressPercent: 0,
      lastAccessed: Date.now(),
    });
    await progress.save();

    res.status(200).json({
      success: true,
      message: "Enrolled successfully!",
      courseId: course._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progressPercent, completed } = req.body; // Get progress percent and completion status from request body
    const studentId = req.user.id; // Get student ID from the logged-in user

    // Find the progress entry for the student and course
    const progress = await Progress.findOne({
      student: studentId,
      course: courseId,
    });
    if (!progress) {
      return res
        .status(404)
        .json({ success: false, message: "Progress entry not found!" });
    }

    // Update progress details
    progress.progressPercent = progressPercent; // Update progress percentage
    progress.completed = completed; // Update completion status
    progress.lastAccessed = Date.now(); // Update the time when the student last accessed the course

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Progress updated successfully!",
      progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const courses = await Course.find({ studentsEnrolled: studentId })
      .select("-reviews -status -rejectionReason")
      .populate("teacher", "name email");

    const progressRecords = await Progress.find({ student: studentId });

    const coursesWithProgress = courses.map((course) => {
      const progress = progressRecords.find(
        (p) => p.course.toString() === course._id.toString()
      );
      return {
        ...course.toObject(),
        progress: progress
          ? {
              completedLectures: progress.completedLectures,
              totalLectures: progress.totalLectures,
              percentage: Math.round(
                (progress.completedLectures / progress.totalLectures) * 100
              ),
            }
          : {
              completedLectures: 0,
              totalLectures: 0,
              percentage: 0,
            },
      };
    });

    res.status(200).json({
      success: true,
      courses,
      coursesWithProgress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const isEnrolled = course.studentsEnrolled.includes(studentId);
    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Remove student from enrolled list
    course.studentsEnrolled = course.studentsEnrolled.filter(
      (id) => id.toString() !== studentId
    );

    await course.save();

    res.status(200).json({
      success: true,
      message: "Successfully unenrolled from the course",
      courseId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the student is enrolled in this course
    if (!course.studentsEnrolled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to leave a review",
      });
    }

    // Check if the user already left a review
    const existingReview = course.reviews.find(
      (r) => r.user.toString() === userId
    );
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // Add the new review
    const newReview = {
      user: userId,
      rating,
      comment,
    };
    course.reviews.push(newReview);

    // Update the average rating
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.rating = totalRating / course.reviews.length;

    await course.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const review = course.reviews.find((r) => r.user.toString() === userId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "You haven't reviewed this course yet",
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    // Update course average rating
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.rating = totalRating / course.reviews.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const reviewIndex = course.reviews.findIndex(
      (r) => r.user.toString() === userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "You haven't reviewed this course yet",
      });
    }

    course.reviews.splice(reviewIndex, 1);

    // Recalculate average rating
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.rating = course.reviews.length
      ? totalRating / course.reviews.length
      : 0;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select(
      "-password -failedAttempts"
    );
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const student = await User.findById(req.user.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }

    // Only update fields if provided
    if (name) student.name = name;
    if (email) student.email = email;
    if (password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: studentId,
    })
      .select("-reviews -status -rejectionReason")
      .populate("teacher", "name email")
      .populate("studentsEnrolled", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you are not enrolled in this course",
      });
    }

    const progress = await Progress.findOne({
      student: studentId,
      course: courseId,
    });

    const courseWithProgress = {
      ...course.toObject(),
      progress: progress
        ? {
            completedLectures: progress.completedLectures,
            totalLectures: progress.totalLectures,
            percentage: Math.round(
              (progress.completedLectures / progress.totalLectures) * 100
            ),
          }
        : {
            completedLectures: 0,
            totalLectures: 0,
            percentage: 0,
          },
    };
    res.status(200).json({
      success: true,
      course: courseWithProgress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  enrollInCourse,
  getEnrolledCourses,
  unenrollFromCourse,
  createReview,
  updateReview,
  deleteReview,
  updateProgress,
  getStudentProfile,
  updateUserProfile,
  getCourseDetails,
};
