const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    picture: {
      type: String,
      default:
        "https://i.postimg.cc/4N5XCZsB/user-Image.png",
    },
    // lockUntil: {
    //   type: Date,
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
