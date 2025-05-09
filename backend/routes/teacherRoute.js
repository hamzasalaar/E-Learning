const express = require("express");
const { isTeacher } = require("../middleware/isTeacher");
const { isAuthenticated } = require("../middleware/userAuth");
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
  getSingleCourse, // ✅ correct import
  getTeacherProfile,
} = require("../controllers/teacherController");

const {
  getMaterialsForCourse, // ✅ materials import
} = require("../controllers/materialController");

// 🔐 For Notifications system
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { updateUserProfile } = require("../controllers/studentController");

const TeacherRoute = express.Router();

// 🔐 Middleware: apply to all
TeacherRoute.use(isAuthenticated);

// ✅ Course routes
TeacherRoute.get("/profile", getTeacherProfile);
TeacherRoute.put("/update-profile", updateUserProfile);
TeacherRoute.get("/courses", isTeacher, getTeacherCourses);
TeacherRoute.post("/create-course", isTeacher, upload.array("lectureNotes", 10), createCourse);
TeacherRoute.put("/update-course/:courseId", isTeacher, upload.array("lectureNotes", 10), updateCourse);
TeacherRoute.delete("/delete/:courseId", isTeacher, deleteCourse);

// ✅ Student + resubmit
TeacherRoute.get("/courses/:courseId/enrollments", isTeacher, getEnrolledStudents);
TeacherRoute.post("/courses/:courseId/resubmit", isTeacher, resubmitCourse);

// ✅ NEW: Single course + materials
TeacherRoute.get("/courses/:courseId", isTeacher, getSingleCourse);
TeacherRoute.get("/courses/:courseId/materials", isTeacher, getMaterialsForCourse);

// ✅ Routes for Notifications
// must be after isAuthenticated middleware
TeacherRoute.get("/notifications", isTeacher, getNotifications);
TeacherRoute.put("/notifications/:id/read", isTeacher, markAsRead);
TeacherRoute.put("/notifications/read-all", isTeacher, markAllAsRead);

module.exports = TeacherRoute;
