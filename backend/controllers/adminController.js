const UserModel = require("../models/userModel");
const CourseModel = require("../models/courseModel");
const mongoose = require("mongoose");

const userInfo = (req, res) => {
  const { _id, name, email, role } = req.user;
  res.status(200).json({
    success: true,
    user: {
      _id,
      name,
      email,
      role,
    },
  });
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalStudents = await UserModel.countDocuments({ role: "student" });
    const totalTeachers = await UserModel.countDocuments({ role: "teacher" });

    const totalCourses = await CourseModel.countDocuments();
    const approvedCourses = await CourseModel.countDocuments({
      status: "approved",
    });
    const pendingCourses = await CourseModel.countDocuments({
      status: "pending",
    });
    const rejectedCourses = await CourseModel.countDocuments({
      status: "rejected",
    });

    const totalEnrollments = await CourseModel.aggregate([
      { $project: { enrolled: { $size: "$studentsEnrolled" } } },
      { $group: { _id: null, total: { $sum: "$enrolled" } } },
    ]);

    const topTeachers = await CourseModel.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$teacher", totalCourses: { $sum: 1 } } },
      { $sort: { totalCourses: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "teacherInfo",
        },
      },
      { $unwind: "$teacherInfo" },
      {
        $project: {
          name: "$teacherInfo.name",
          email: "$teacherInfo.email",
          totalCourses: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        approvedCourses,
        pendingCourses,
        rejectedCourses,
        totalEnrollments: totalEnrollments[0]?.total || 0,
        topTeachers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Dashboard stats error" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await UserModel.find({ status: "active" });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const user = await UserModel.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    if (user.role === "admin")
      return res
        .status(401)
        .json({ success: false, message: "Admin can't be deleted!" });

    if (user.role === "teacher") {
      await CourseModel.updateMany(
        { teacher: userId },
        { $set: { status: "archived", teacher: null } } // Archive courses and remove teacher reference
      );
    }

    user.status = "deleted";
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    // Only allow admins to access this
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    const courses = await CourseModel.find()
      .populate("teacher", "name email") // Populate teacher info (name and email only)
      .exec();

    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  userInfo,
  getUser,
  deleteUser,
  updateUser,
  getCourses,
};
