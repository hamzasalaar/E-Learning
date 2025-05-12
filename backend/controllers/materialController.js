// controllers/materialController.js
const Material = require("../models/materialModel");
const Course = require("../models/courseModel");
const fs = require("fs");
const path = require("path");

// Upload new material
const addMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type, url, dueDate, instructions } = req.body;

    const validTypes = ["lecture", "video", "reading", "assignment", "quiz"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: `Invalid material type: ${type}` });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    let filePaths = [];

    if (req.files && req.files.length > 0) {
      filePaths = req.files.map((file) => file.path);
    }

    if (type !== "lecture" && !url && filePaths.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File(s) or URL is required for this material type.",
      });
    }

    const materialData = {
      course: courseId,
      title,
      type,
      dueDate,
      instructions,
      filePaths,
      url,
    };

    const material = await Material.create(materialData);

    res.status(201).json({
      success: true,
      message: "Material added successfully.",
      material,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMaterialsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (
      course.teacher.toString() !== req.user.id &&
      !course.studentsEnrolled.includes(req.user.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const materials = await Material.find({ course: courseId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { courseId, materialId } = req.params;
    const { title, type, url, dueDate, instructions } = req.body;

    const material = await Material.findOne({
      _id: materialId,
      course: courseId,
    });
    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found." });
    }

    if (req.files && req.files.length > 0) {
      if (material.filePaths && material.filePaths.length > 0) {
        material.filePaths.forEach((fp) => fs.unlink(fp, () => {}));
      }

      material.filePaths = req.files.map((file) => file.path);
    }

    // Update fields only if provided
    if (title !== undefined) material.title = title;
    if (type !== undefined) material.type = type;
    if (url !== undefined) material.url = url;
    if (dueDate !== undefined) material.dueDate = dueDate;
    if (instructions !== undefined) material.instructions = instructions;

    await material.save();

    res.status(200).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { courseId, materialId } = req.params;

    const material = await Material.findOneAndDelete({
      _id: materialId,
      course: courseId,
    });

    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found." });
    }

    // Delete associated file
    if (material.filePaths && material.filePaths.length > 0) {
      material.filePaths.forEach((fp) => fs.unlink(fp, () => {}));
    }

    res.status(200).json({ success: true, message: "Material deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMaterialsForCourse,
  addMaterial,
  updateMaterial,
  deleteMaterial,
};
