const express = require("express");
const router = express.Router();
const PageBackground = require("../models/PageBackground");
const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");

// Default paths
const defaultBackgrounds = {
  "rating": "/uploads/background2.jpg",
  "heard-about": "/uploads/7.jpg",  
  "form-contact": "/uploads/6.jpg"
};

// Get background by page name
router.get("/:page_name", async (req, res) => {
  try {
    const { page_name } = req.params;
    console.log(`🔍 Fetching background for page: ${page_name}`);
    
    // First, try to find existing background in database
    const bg = await PageBackground.findOne({ page_name }).populate("image_id");   // populate("image_id") means: get full image info from the Image collection, not just the ID.
    
    if (bg && bg.image_id) {
      console.log(`✅ Found background in DB for ${page_name}`);
      return res.json(bg);
    }
    
    // If no background found in DB, return default
    const defaultPath = defaultBackgrounds[page_name];
    if (defaultPath) {
      console.log(`📁 Using default background for ${page_name}: ${defaultPath}`);
      return res.json({ 
        page_name,
        image_id: { path: defaultPath },
        isDefault: true 
      });
    }
    
    // If no default exists either
    console.log(`❌ No background found for ${page_name}`);
    return res.status(404).json({ 
      message: `No background found for page: ${page_name}` 
    });
    
  } catch (err) {
    console.error("❌ Background fetch failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create or update background for a page
router.post("/", async (req, res) => {
  try {
    const { page_name, image_id } = req.body;
    
    if (!page_name || !image_id) {
      return res.status(400).json({ 
        message: "page_name and image_id are required" 
      });
    }
    
    console.log(`🔄 Setting background for ${page_name} with image_id: ${image_id}`);
    
    // Check if image exists
    const imageExists = await Image.findById(image_id);
    if (!imageExists) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Check if there's an existing background to clean up
    const existingBackground = await PageBackground.findOne({ page_name }).populate("image_id");
    
    if (existingBackground && existingBackground.image_id) {
      console.log(`🗑️ Cleaning up old background for ${page_name}`);
      
      // Delete old physical file
      const oldImagePath = path.join(__dirname, "..", "uploads", existingBackground.image_id.filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log(`🗑️ Deleted old file: ${oldImagePath}`);
      }
      
      // Delete old image record
      await Image.findByIdAndDelete(existingBackground.image_id._id);
      console.log(`🗑️ Deleted old image record: ${existingBackground.image_id._id}`);
    }
    
    // Update existing or create new background
    const background = await PageBackground.findOneAndUpdate(
      { page_name },
      { page_name, image_id },
      { upsert: true, new: true }
    ).populate("image_id");
    
    console.log(`✅ Background updated for ${page_name}`);
    res.json(background);
    
  } catch (err) {
    console.error("❌ Background update failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete background for a page (revert to default) - FIXED VERSION
router.delete("/:page_name", async (req, res) => {
  try {
    const { page_name } = req.params;
    console.log(`🗑️ Attempting to delete background for: ${page_name}`);
    
    // Find the background with populated image data
    const background = await PageBackground.findOne({ page_name }).populate("image_id");
    
    if (!background) {
      console.log(`❌ No background found for ${page_name}`);
      return res.status(404).json({ 
        message: `No custom background found for ${page_name}` 
      });
    }

    if (!background.image_id) {
      console.log(`❌ Background found but no image associated for ${page_name}`);
      // Delete the orphaned background record
      await PageBackground.findByIdAndDelete(background._id);
      return res.status(404).json({ 
        message: `No image associated with background for ${page_name}` 
      });
    }

    console.log(`🗑️ Found background with image for ${page_name}:`, {
      backgroundId: background._id,
      imageId: background.image_id._id,
      filename: background.image_id.filename
    });

    // Delete the physical file
    const filePath = path.join(__dirname, "..", "uploads", background.image_id.filename);
    console.log(`🗑️ Attempting to delete file: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Physical file deleted: ${filePath}`);
    } else {
      console.log(`⚠️ Physical file not found: ${filePath}`);
    }

    // Delete the image record from database
    await Image.findByIdAndDelete(background.image_id._id);
    console.log(`✅ Image record deleted: ${background.image_id._id}`);

    // Delete the page background record
    await PageBackground.findByIdAndDelete(background._id);
    console.log(`✅ PageBackground record deleted: ${background._id}`);

    console.log(`🎉 Successfully deleted all data for ${page_name}`);
    res.json({ 
      message: `Background and associated files deleted for ${page_name}`,
      deletedFiles: [filePath],
      deletedRecords: {
        pageBackground: background._id,
        image: background.image_id._id
      }
    });
    
  } catch (err) {
    console.error("❌ Background deletion failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all backgrounds
router.get("/", async (req, res) => {
  try {
    const backgrounds = await PageBackground.find().populate("image_id");
    
    const result = {};
    backgrounds.forEach(bg => {
      if (bg.image_id) {
        result[bg.page_name] = bg.image_id.path;
      }
    });
    
    // Add defaults for missing pages
    Object.keys(defaultBackgrounds).forEach(page => {
      if (!result[page]) {
        result[page] = defaultBackgrounds[page];
      }
    });
    
    res.json(result);
  } catch (err) {
    console.error("❌ Failed to fetch all backgrounds:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;