const express = require('express');
const AuthRoutes = express.Router();
const { Register, Login, Logout } = require('../controllers/authController');
const {isAuthenticated} = require("../middleware/userAuth");

AuthRoutes.post('/register', Register);
AuthRoutes.post('/login', Login);
AuthRoutes.post('/logout', Logout);
AuthRoutes.get("/check-auth", isAuthenticated, (req, res) => {
  res.json({ success: true, message: "User is authenticated", user: req.user });
});

module.exports = AuthRoutes;