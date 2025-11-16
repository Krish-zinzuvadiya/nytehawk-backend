require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
console.log("Hello");

console.log("MONGO_URL:", process.env.MONGO_URL);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Loaded" : "Missing");
// ---------------------- MONGODB CONNECTION ----------------------
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Error:", err));


// ---------------------- IMPORT ROUTES ----------------------
// Make sure these files exist in /routes folder
app.use(require('./routes/subscribe'));
app.use(require('./routes/medicine'));
app.use(require('./routes/transaction'));
app.use(require('./routes/app'));


// ---------------------- USER SCHEMA ----------------------
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
    relative2Phone: String
}, { timestamps: true });

const User = mongoose.model("SignupDetails", UserSchema);


// ---------------------- AUTH ROUTES ----------------------

// ⭐ Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const exists = await User.findOne({ email: req.body.email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const newUser = new User(req.body);
        await newUser.save();

        res.json({ success: true, message: "Signup successful", user: newUser });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, message: "Signup error" });
    }
});


// ⭐ Login Route
app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        res.json({ success: true, message: "Login successful", user });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Login error" });
    }
});


// ⭐ Update Route
app.put('/api/update', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.body.email },
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User updated", user: updatedUser });

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: "Update failed" });
    }
});


// ---------------------- TEST ROUTE ----------------------
app.get('/api/test', (req, res) => res.send("API is working!"));

// ---------------------- SERVER LISTEN ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



