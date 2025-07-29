const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');  // Importe le modèle Feedback (MongoDB via Mongoose)

// POST  Create new feedback and return the full document
router.post('/', async (req, res) => {
  try {
    console.log('Received POST request to /api/feedbacks');
    console.log('Request body:', req.body);

    // Ensure an _id is not passed in the body on creation
    if (req.body._id) {
      console.log('Error: Attempted to create feedback with an existing _id.');
      return res.status(400).json({ message: 'Cannot create a feedback with a specified _id' });
    }
    
    //Create a new document using data from the request and save it in the database.
    const newFeedback = new Feedback(req.body);
    console.log('Creating new feedback document:', newFeedback);
    const savedFeedback = await newFeedback.save();
    console.log('Feedback saved successfully:', savedFeedback);

    // Return the full saved document
    res.status(201).json(savedFeedback);

  } catch (error) {
    console.error('Error saving feedback:', error.message);
    console.error(error.stack); // Log the full stack trace
    res.status(500).json({ message: 'Error saving feedback' });
  }
});

// PATCH /api/feedbacks - Update feedback by _id
router.patch('/', async (req, res) => {
  const { _id, ...updateFields } = req.body; //Extracts _id from the body,...updateFields holds the rest of the fields to update

  if (!_id) {
    return res.status(400).json({ message: 'An _id is required for updates' });
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'No update fields provided' }); //user sends only the _id but no fields to update
  }

  try {
    const feedback = await Feedback.findByIdAndUpdate( // findByIdAndUpdate: finds the document by _id and applies the update.
      _id,
      updateFields,
      { new: true, runValidators: true } //  returns the updated version,runValidators: true: forces schema validation during the update
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json(feedback); //Returns the updated feedback 

  } catch (error) {
    console.error('Error in PATCH /api/feedbacks:', error.message);
    res.status(500).json({ message: 'Server error during update' });
  }
});

// GET /api/feedbacks - Get all feedbacks (only limited fields)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })      //sorts the documents so the newest feedbacks come first.

    res.status(200).json(feedback); // Renvoie les feedbacks avec un statut HTTP 200
 

  } catch (error) {
    console.error('Error fetching feedbacks:', error.message);
    res.status(500).json({ message: 'Error fetching feedbacks' });
  }
});

// Exporte le router pour l’utiliser dans le fichier principal (server.js)

    module.exports = router;
