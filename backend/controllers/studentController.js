const Course = require("../models/courseModel");
const User = require("../models/userModel");

const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found!" });
    }

    // Check if the student is enrolled in the course
    if (!course.studentsEnrolled.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: "You must be enrolled in the course to leave a review!" });
    }

    // Create the review
    const review = {
      user: req.user.id,
      rating,
      comment,
      createdAt: Date.now(),
    };

    // Add the review to the course
    course.reviews.push(review);

    // Update the course's average rating
    const totalReviews = course.reviews.length;
    const sumRatings = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating = sumRatings / totalReviews;

    // Save the updated course
    await course.save();

    res.status(201).json({ success: true, message: "Review added successfully!", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  module.exports = {
    createReview,
  };
