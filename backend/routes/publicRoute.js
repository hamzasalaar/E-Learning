const express = require("express");
const {
  publicCourses,
  getAllTeachers,
  getCourseDetailsPublic,
} = require("../controllers/publicController");

const PublicRoute = express.Router();

PublicRoute.get("/home", publicCourses);
PublicRoute.get("/courses", publicCourses); // ✅ FIXED
PublicRoute.get("/teachers", getAllTeachers); // ✅ FIXED
PublicRoute.get("/courses/:courseId", getCourseDetailsPublic); // ✅ FIXED

module.exports = PublicRoute;
