const express = require("express");
const { isAuthenticated } = require("../middleware/userAuth");
const { isStudent } = require("../middleware/isStudent");
const {
  getEnrolledCourses,
  enrollInCourse,
  createReview,
  updateReview,
  deleteReview,
  unenrollFromCourse,
  updateProgress,
  getStudentProfile,
  updateUserProfile,
  getCourseDetails,
} = require("../controllers/studentController");
const { getMaterialsForCourse } = require("../controllers/materialController");
const {
  joinLiveSession,
  getLiveSessionsByCourse,
  getRecordings,
} = require("../controllers/liveSessionController");

const StudentRoute = express.Router();

// Apply authentication middleware to all routes
StudentRoute.use(isAuthenticated, isStudent);

StudentRoute.get("/profile", getStudentProfile);
StudentRoute.put("/profile", updateUserProfile);

StudentRoute.post("/enroll/:courseId", enrollInCourse);
StudentRoute.get("/my-courses", getEnrolledCourses);
StudentRoute.post("/unenroll/:courseId", unenrollFromCourse);

StudentRoute.post("/review/:courseId", createReview);
StudentRoute.put("/:courseId/update-review", updateReview);
StudentRoute.delete("/:courseId/review", deleteReview);

StudentRoute.put("/progress/:courseId", updateProgress); // Update progress in a course
StudentRoute.get("/courses/:courseId", getCourseDetails);
StudentRoute.get("/courses/:courseId/materials", getMaterialsForCourse);
StudentRoute.get("/recordings/:meetingID", getRecordings);

// Live session routes

StudentRoute.get("/course/:courseId/live-sessions", getLiveSessionsByCourse); // Get live sessions for a course
StudentRoute.get("/session/:sessionId/join", joinLiveSession);
module.exports = StudentRoute;
