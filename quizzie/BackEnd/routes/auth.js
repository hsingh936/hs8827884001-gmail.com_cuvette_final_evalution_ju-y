const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Error Handler Middleware 
const errorHandler = (req, res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
};

// Signup Route

router.post('/Signup', async (req, res) => {
    try {
        const { name, email, password,confirmPassword} = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const user = new User({ name, email, password: hashedPassword, confirmPassword});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        errorHandler(req, res, error);
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If the password is valid, generate a JWT token
        const token = jwt.sign({ userId: user._id, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: '48hr', // Token expiration time
        });

        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        errorHandler(req, res, error);
    }
});

module.exports = router;
