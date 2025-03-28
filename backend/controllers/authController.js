const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    const usernameExists = await UserModel.findOne({ name });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        error: "Username is already taken. Please choose another one.",
      });
    }

    const hashPassword = await bcrypt.hashSync(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save()

    res.status(201).json({
      message: "User registered successfully!",
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials!" });
    }

    // Check if the account is locked due to too many failed attempts
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        success: false,
        message: `Account is locked. Try again after ${new Date(user.lockUntil).toLocaleString()}`,
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {

      user.failedAttempts += 1;

      if (user.failedAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; 
      }

      await user.save();

      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials!" });
    }

    user.failedAttempts = 0;
    user.lockUntil = null; 
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, message: "Login successfull!", user });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log(error);
  }
};

module.exports = { Register, Login, Logout };
