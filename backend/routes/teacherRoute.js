// routes/teacherRoute.js
const express = require("express");
const { isAuthenticated } = require("../middleware/userAuth");
const { isTeacher } = require("../middleware/isTeacher");
const upload = require("../utils/multerConfig");

const {
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const {
  getTeacherCourses,
  getEnrolledStudents,
  resubmitCourse,
  getSingleCourse,
} = require("../controllers/teacherController");

const {
  getMaterialsForCourse,
} = require("../controllers/materialController"); // ✅ double-check path and export name

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const TeacherRoute = express.Router();

TeacherRoute.use(isAuthenticated, isTeacher);

TeacherRoute.get("/courses", getTeacherCourses);
TeacherRoute.post("/create-course", upload.array("lectureNotes", 10), createCourse);
TeacherRoute.put("/update-course/:courseId", upload.array("lectureNotes", 10), updateCourse);
TeacherRoute.delete("/delete/:courseId", deleteCourse);
TeacherRoute.get("/courses/:courseId/enrollments", getEnrolledStudents);
TeacherRoute.post("/courses/:courseId/resubmit", resubmitCourse);
TeacherRoute.get("/courses/:courseId", getSingleCourse);
TeacherRoute.get("/courses/:courseId/materials", getMaterialsForCourse); // 🟩 This should not be undefined

TeacherRoute.get("/notifications", getNotifications);
TeacherRoute.put("/notifications/:id/read", markAsRead);
TeacherRoute.put("/notifications/read-all", markAllAsRead);

module.exports = TeacherRoute;
