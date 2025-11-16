// routes/medicine.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Medicine Order Schema
const medicineSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  medicalStoreName: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const MedicineOrder = mongoose.model('Medicine', medicineSchema);

// Save medicine order in DB
router.post('/api/medicine', async (req, res) => {
  try {
    const { userName, medicalStoreName, transactionId, totalPrice } = req.body;

    if (!userName || !medicalStoreName || !transactionId || !totalPrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new MedicineOrder({
      userName,
      medicalStoreName,
      transactionId,
      totalPrice
    });

    await newOrder.save();

    res.status(201).json({ message: 'Medicine order saved successfully', order: newOrder });
  } catch (err) {
    console.error('Error saving medicine order:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
