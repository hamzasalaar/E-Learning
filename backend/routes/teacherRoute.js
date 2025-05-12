const express = require("express");
const { isAuthenticated } = require("../middleware/userAuth");
const { isTeacher } = require("../middleware/isTeacher");
const upload = require("../utils/multerConfig");
const { checkFileSize } = require("../middleware/fileSize"); // ✅ correct import

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
  getTeacherProfile,
  updateTeacherProfile,
} = require("../controllers/teacherController");

const {
  getMaterialsForCourse,
  addMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { updateUserProfile } = require("../controllers/studentController");
const uploadImage = require("../utils/uploadImage");

const TeacherRoute = express.Router();

// 🔐 Middleware: apply to all
TeacherRoute.use(isAuthenticated, isTeacher);

// ✅ Course routes
TeacherRoute.get("/profile", getTeacherProfile);
TeacherRoute.put("/update-profile", updateUserProfile);
TeacherRoute.get("/courses", getTeacherCourses);
TeacherRoute.post("/create-course", uploadImage.single("image"), createCourse);
TeacherRoute.put(
  "/update-course/:courseId",
  uploadImage.single("image"),
  updateCourse
);
TeacherRoute.delete("/delete/:courseId", deleteCourse);

// ✅ Student + resubmit
TeacherRoute.get("/courses/:courseId/enrollments", getEnrolledStudents);
TeacherRoute.post("/courses/:courseId/resubmit", resubmitCourse);

// ✅ NEW: Single course + materials
TeacherRoute.get("/courses/:courseId", getSingleCourse);
TeacherRoute.get("/courses/:courseId/materials", getMaterialsForCourse);
TeacherRoute.post(
  "/courses/add-material/:courseId",
  checkFileSize,
  upload.array("files", 10),
  addMaterial
);
TeacherRoute.put(
  "/courses/:courseId/materials/:materialId",
  checkFileSize,
  upload.array("files", 10),
  updateMaterial
);
TeacherRoute.delete("/courses/:courseId/materials/:materialId", deleteMaterial);

// ✅ Routes for Notifications
// must be after isAuthenticated middleware
// TeacherRoute.get("/notifications", isTeacher, getNotifications);
// TeacherRoute.put("/notifications/:id/read", isTeacher, markAsRead);
// TeacherRoute.put("/notifications/read-all", isTeacher, markAllAsRead);

module.exports = TeacherRoute;
