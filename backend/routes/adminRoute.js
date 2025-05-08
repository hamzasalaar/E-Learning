const express = require("express");
const {
  getUser,
  deleteUser,
  updateUser,
  getCourses,
  userInfo,
  getAdminStats,
} = require("../controllers/adminController");
const { isAdmin } = require("../middleware/adminAuth");
const {
  approveCourse,
  rejectCourse,
  deleteCourse,
  getCourseStats,
} = require("../controllers/courseController");

const AdminRoute = express.Router();

AdminRoute.get("/me", isAdmin, userInfo);
AdminRoute.get("/stats", isAdmin, getAdminStats);

AdminRoute.get("/getuser", isAdmin, getUser);
AdminRoute.post("/deleteuser/:id", isAdmin, deleteUser);
AdminRoute.put("/update/:id", isAdmin, updateUser);

AdminRoute.get("/courses", isAdmin, getCourses); // Get all courses
AdminRoute.put("/course/approve/:courseId", isAdmin, approveCourse); // Approve a course
AdminRoute.put("/course/reject/:courseId", isAdmin, rejectCourse); // Reject a course
AdminRoute.delete("/course/delete/:courseId", isAdmin, deleteCourse); // Delete a course
AdminRoute.get("/course/stats/:courseId", isAdmin, getCourseStats); // Get course stats

module.exports = AdminRoute;
