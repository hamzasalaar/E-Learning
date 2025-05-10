// controllers/materialController.js
const Material = require("../models/materialModel");
const Course = require("../models/courseModel");

const getMaterialsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const materials = await Material.find({ course: courseId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMaterialsForCourse, // ✅ Make sure this name matches the import
};
