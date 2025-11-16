// routes/contact.js - Handles contact form messages and auto-replies

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// 🔐 Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 📩 POST /send-mail
router.post('/send-mail', async (req, res) => {
  const { name, email, message } = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const mailOptions = {
    from: `"NyteHawk Contact" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Thanks for contacting NyteHawk!',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <h2>Welcome to the NyteHawk Family! 🚀</h2>
        <p>Hi ${name},</p>
        <p>We’ve received your message:</p>
        <blockquote style="color: #555; border-left: 4px solid #0078ff; padding-left: 10px;">${message}</blockquote>
        <p>We'll get back to you soon.</p>
        <hr/>
        <p><strong>We provide you:</strong></p>
        <ul>
          <li>🏥 Best Hospitals</li>
          <li>💊 Nearby Pharmacies</li>
          <li>🍽️ Restaurants & Cafes</li>
          <li>🏧 ATM locators</li>
          <li>⛽ Fuel Stations and more (upcoming...)</li>
        </ul>
        <p>Follow us:<br/>
          <a href="https://github.com/krishzinzuvadiya" style="text-decoration:none;">🐙 GitHub</a> |
          <a href="https://instagram.com/krish_zinzuvadiya09" style="text-decoration:none;">📸 Instagram</a>
        </p>
        <p><strong>– Team NyteHawk</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ Contact Email Error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;
