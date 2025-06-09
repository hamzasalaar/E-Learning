const CourseModel = require("../models/courseModel");
const UserModel = require("../models/userModel");

const publicCourses = async (req, res) => {
  try {
    // Fetch all approved courses
    const courses = await CourseModel.find({ status: "approved" })
      .populate("teacher", "name email picture")
      .sort({ rating: -1 }); // most rated courses first

    // Count number of courses per teacher
    const courseCountMap = {};
    for (const course of courses) {
      const teacherId = course.teacher._id.toString();
      courseCountMap[teacherId] = (courseCountMap[teacherId] || 0) + 1;
    }

    // Extract unique teacher objects from populated courses
    const tutorMap = {};
    courses.forEach((course) => {
      const teacher = course.teacher;
      tutorMap[teacher._id.toString()] = teacher;
    });

    // Build tutor array with courseCount
    const tutors = Object.entries(tutorMap)
      .map(([id, tutor]) => ({
        ...tutor._doc,
        courseCount: courseCountMap[id] || 0,
      }))
      .sort((a, b) => b.courseCount - a.courseCount) // most courses first
      .slice(0, 6); // top 6 tutors

    res.status(200).json({ success: true, courses, tutors });
  } catch (error) {
    console.error("Failed to load homepage data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await UserModel.find({ role: "teacher" }).select(
      "name email picture"
    );

    const teacherData = await Promise.all(
      teachers.map(async (teacher) => {
        const courses = await CourseModel.find({ teacher: teacher._id });
        return {
          ...teacher.toObject(),
          courseCount: courses.length,
        };
      })
    );

    res.status(200).json({ success: true, teachers: teacherData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourseDetailsPublic = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await CourseModel.findOne({
      _id: courseId,
      status: "approved", // only show approved courses to public
    })
      .select(
        "title description price rating imageUrl studentsEnrolled reviews teacher"
      )
      .populate("teacher", "name") // only populate teacher name
      .populate("reviews.user", "name"); // only populate reviewer name

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not publicly accessible",
      });
    }

    // Only send student count, not full list
    const courseData = {
      _id: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      rating: course.rating,
      imageUrl: course.imageUrl,
      teacher: course.teacher,
      studentsEnrolledCount: course.studentsEnrolled?.length || 0,
      reviews: course.reviews?.map((rev) => ({
        rating: rev.rating,
        comment: rev.comment,
        student: rev.user?.name || "Anonymous",
      })),
    };

    res.status(200).json({
      success: true,
      course: courseData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  publicCourses,
  getAllTeachers,
  getCourseDetailsPublic,
};
