const express = require("express");
const { isTeacher } = require("../middleware/isTeacher");
const upload = require("../utils/multerConfig");
const { isAuthenticated } = require("../middleware/userAuth");
const {
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const {
  getEnrolledStudents,
  getTeacherCourses,
} = require("../controllers/teacherController");

const TeacherRoute = express.Router();

TeacherRoute.use(isAuthenticated); // Apply authentication middleware to all routes

TeacherRoute.get("/courses", isTeacher, getTeacherCourses);
TeacherRoute.post(
  "/create-course",
  isTeacher,
  upload.single("lectureNotes"),
  createCourse
); // Create a course
TeacherRoute.put(
  "/update-course/:courseId",
  isTeacher,
  upload.single("lectureNotes"),
  updateCourse
); // Update a course
TeacherRoute.delete("/delete/:courseId", isTeacher, deleteCourse); // Delete a course
TeacherRoute.get(
  "/courses/:courseId/enrollments",
  isTeacher,
  getEnrolledStudents
);

module.exports = TeacherRoute;
