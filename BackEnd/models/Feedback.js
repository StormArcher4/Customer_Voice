const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  satisfaction: { type: String },
  heardAbout: { type: String },
  comments: { type: String },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Feedback', feedbackSchema);
