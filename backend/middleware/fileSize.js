// Custom middleware to handle file size error
const checkFileSize = (req, res, next) => {
  if (req.files) {
    for (const file of req.files) {
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds the maximum limit of 10MB. File "${file.originalname}" is too large.`,
        });
      }
    }
  }
  next();
};

module.exports = { checkFileSize };
