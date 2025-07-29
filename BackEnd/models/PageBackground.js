const mongoose = require("mongoose");

const pageBackgroundSchema = new mongoose.Schema({
  page_name: {
    type: String,
    required: true,
    unique: true,
    enum: ['rating', 'heard-about', 'form-contact'] // Only allow these page names

  },
  image_id: {
    type: mongoose.Schema.Types.ObjectId, //This field will store a MongoDB document ID  (like foreign keys)
    ref: "Image",  // Reference to the Image model
  },
});

module.exports = mongoose.model("PageBackground", pageBackgroundSchema);
