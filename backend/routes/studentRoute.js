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
const uploadProfilePic = require("../utils/uploadProfilePic");

const StudentRoute = express.Router();

// Apply authentication middleware to all routes
StudentRoute.use(isAuthenticated, isStudent);

StudentRoute.get("/profile", getStudentProfile);
StudentRoute.put(
  "/profile",
  uploadProfilePic.single("profilePic"),
  updateUserProfile
);

StudentRoute.post("/enroll/:courseId", enrollInCourse);
StudentRoute.get("/my-courses", getEnrolledCourses);
StudentRoute.post("/unenroll/:courseId", unenrollFromCourse);

StudentRoute.post("/review/:courseId", createReview);
StudentRoute.put("/review/:courseId", updateReview);
StudentRoute.delete("/review/:courseId", deleteReview);

StudentRoute.put("/progress/:courseId", updateProgress); // Update progress in a course
StudentRoute.get("/courses/:courseId", getCourseDetails);
StudentRoute.get("/courses/:courseId/materials", getMaterialsForCourse);
StudentRoute.get("/recordings/:meetingID", getRecordings);

// Live session routes

StudentRoute.get("/course/:courseId/live-sessions", getLiveSessionsByCourse); // Get live sessions for a course
StudentRoute.get("/session/:sessionId/join", joinLiveSession);
module.exports = StudentRoute;
