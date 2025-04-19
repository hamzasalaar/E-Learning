const express = require("express");
const { createReview } = require("../controllers/studentController");
const { isAuthenticated } = require("../middleware/userAuth");
const { isStudent } = require("../middleware/isStudent");

const StudentRoute = express.Router();

StudentRoute.post(
  "/api/student/:courseId/review",
  isAuthenticated,
  isStudent,
  createReview
);
