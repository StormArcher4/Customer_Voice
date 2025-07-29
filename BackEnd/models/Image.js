const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
    unique: true
  },
  path: {   //where the file is stored on the server
    type: String,
    required: true
  },
  mimetype: {  //the type of file (e.g., image/jpeg)
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
}, {
  timestamps: true  //Adds createdAt and updatedAt fields automatically.
});

module.exports = mongoose.model("Image", imageSchema);