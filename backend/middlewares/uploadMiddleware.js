const multer = require("multer");

// Use memory storage to avoid EPIPE stream errors
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;