const express = require("express");
const { publicCourses } = require("../controllers/publicController");

const PublicRoute = express.Router();

PublicRoute.get("/home", publicCourses);

module.exports = PublicRoute;
