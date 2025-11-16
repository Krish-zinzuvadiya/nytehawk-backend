require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB Error:', err));


// ---------------- ROUTES ----------------

// Subscribe Route
const subscribeRoute = require('./routes/subscribe');
app.use(subscribeRoute);

// Medicine Route
const medicineRoute = require('./routes/medicine');
app.use(medicineRoute);

// Transaction Route
const transactionRoute = require("./routes/transaction");
app.use(transactionRoute);

// Contact / App Route
const contactRoute = require('./routes/app');
app.use(contactRoute);


// ---------------- USER SCHEMA ----------------

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  gender: String,
  dob: String,
  password: String,
  pincode: String,
  house: String,
  area: String,
  landmark: String,
  city: String,
  state: String,

  relative1Name: String,
  relative1Phone: String,
  relative2Name: String,
  relative2Phone: String,
}, { timestamps: true });

const User = mongoose.model('SignupDetails', UserSchema);


// ---------------- AUTH ROUTES ----------------

// Sign Up
app.post('/api/signup', async (req, res) => {
  const {
    name, email, phone, gender, dob, password,
    pincode, house, area, landmark, city, state,
    relative1Name, relative1Phone, relative2Name, relative2Phone
  } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({
      name, email, phone, gender, dob, password,
      pincode, house, area, landmark, city, state,
      relative1Name, relative1Phone, relative2Name, relative2Phone
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'Signup successful', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Signup error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login error' });
  }
});


// Update User
app.put('/api/update', async (req, res) => {
  const { email, ...updateData } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// Test Route
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});


// ---------------- START SERVER ----------------
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
