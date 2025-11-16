// routes/Transaction.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  restaurantName: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Save order in DB
router.post('/api/transaction', async (req, res) => {
  try {
    const { userName, restaurantName, transactionId, totalPrice } = req.body;

    if (!userName || !restaurantName || !transactionId || !totalPrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({ userName, restaurantName, transactionId, totalPrice });
    await newOrder.save();

    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
