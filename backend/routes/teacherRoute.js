const express = require("express");
const { isTeacher } = require("../middleware/isTeacher");
const { isAuthenticated } = require("../middleware/userAuth");
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
} = require("../controllers/courseController");

const TeacherRoute = express.Router();

TeacherRoute.use(isAuthenticated); // Apply authentication middleware to all routes

TeacherRoute.get("/courses", isTeacher, getTeacherCourses);
TeacherRoute.post("/create-course", isTeacher, createCourse); // Create a course
TeacherRoute.put("/update-course/:courseId", isTeacher, updateCourse); // Update a course
TeacherRoute.delete("/delete/:courseId", isTeacher, deleteCourse); // Delete a course

module.exports = TeacherRoute;