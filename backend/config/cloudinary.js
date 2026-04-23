const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with Environment Variables
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
  secure: true,
  timeout: 60000,
});

console.log("Cloudinary Initialized for Cloud:", process.env.CLOUDINARY_CLOUD_NAME);

// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ai_interviewer_profiles", // Folder name in Cloudinary
    allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

module.exports = { cloudinary, storage };
