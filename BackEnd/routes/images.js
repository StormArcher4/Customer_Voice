const express = require("express");
const router = express.Router();
const multer = require("multer"); //  used primarily for uploading files
const path = require("path");
const fs = require("fs");
const Image = require("../models/Image");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory:", uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📁 Setting destination to:", uploadsDir);
    cb(null, uploadsDir); // Save files to uploads directory
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    console.log("📝 Generated filename:", uniqueName);
    cb(null, uniqueName); //Passes the filename to multer so it saves the file with that name.
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  console.log("🔍 Checking file type:", file.mimetype);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    console.log("✅ File type accepted");
    cb(null, true);
  } else {
    console.log("❌ File type rejected");
    cb(new Error('Only PNG, JPG, and JPEG files are allowed'), false);
  }
};

//  Creates a multer upload handler
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

console.log("🔧 Multer configured successfully");

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Images route is working!" });
});

// POST /api/images/upload - Upload a single image
router.post("/upload", (req, res) => {

  // Apply multer middleware manually
  upload.single("image")(req, res, async (err) => {
    console.log("📦 Multer middleware executed");
    
    if (err) {
      console.error("❌ Multer error:", err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "File too large. Maximum size is 10MB." });
      }
      return res.status(400).json({ message: err.message });
    }

    console.log("📋 Request body keys:", Object.keys(req.body));
    console.log("📁 Request file:", req.file ? "EXISTS" : "MISSING");
    
    if (req.file) {
      console.log("📁 File details:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        size: req.file.size,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path
      });
    }

    if (!req.file) {
      console.log("❌ No file received in request");
      return res.status(400).json({ 
        message: "No image file provided. Make sure the field name is 'image'" 
      });
    }

    try {
      // Save image metadata to database
      const imageData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      };

      console.log("💾 Attempting to save image with data:", imageData);

      const image = new Image(imageData);
      await image.save();

      console.log("✅ Image saved to database with ID:", image._id);

      res.status(201).json({
        message: "Image uploaded successfully",
        image: {
          _id: image._id,
          filename: image.filename,
          originalName: image.originalName,
          path: image.path,
          size: image.size,
          mimetype: image.mimetype
        }
      });

    } catch (error) {
      console.error("❌ Database save failed:", error.message);
      
      // Clean up file if database save failed
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path); // removes the file at the given path.
        console.log("🗑️ Cleaned up uploaded file due to database error");
      }
      
      res.status(500).json({ 
        message: "Database save failed", 
        error: error.message 
      });
    }
  });
});

// GET /api/images - Get all images
router.get("/", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error("❌ Failed to fetch images:", error);
    res.status(500).json({ message: "Failed to fetch images", error: error.message });
  }
});

// GET /api/images/:id - Get specific image
router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    console.error("❌ Failed to fetch image:", error);
    res.status(500).json({ message: "Failed to fetch image", error: error.message });
  }
});

// DELETE /api/images/:id - Delete image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "..", "uploads", image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️ File deleted:", filePath);
    }

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);
    
    console.log("✅ Image deleted:", req.params.id);
    res.json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error("❌ Failed to delete image:", error);
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
});

module.exports = router;