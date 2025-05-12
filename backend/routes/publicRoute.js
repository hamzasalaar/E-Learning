const express = require("express");
const {
  publicCourses,
  getAllTeachers,
} = require("../controllers/publicController");

const PublicRoute = express.Router();

PublicRoute.get("/home", publicCourses);
PublicRoute.get("/courses", publicCourses); // ✅ FIXED
PublicRoute.get("/teachers", getAllTeachers); // ✅ FIXED

module.exports = PublicRoute;
