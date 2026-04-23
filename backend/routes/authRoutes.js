const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);     // Register User
router.post("/login", loginUser);     // Login User
router.get("/profile", protect, getUserProfile);     // Get User Profile

router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Convert buffer to base64 data URI
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        console.log("Attempting Cloudinary upload for file type:", req.file.mimetype, "Size:", req.file.size);

        // Upload to Cloudinary using the base64 string
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "ai_interviewer_profiles",
        });

        console.log("Cloudinary Upload Success:", result.secure_url);

        res.status(200).json({ imageUrl: result.secure_url });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ message: "Upload to Cloudinary failed", error: error.message });
    }
});

module.exports = router;

