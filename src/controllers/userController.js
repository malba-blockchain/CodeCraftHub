/**
 * @fileoverview This file contains the controller functions for user-related operations,
 * including user registration and login.
 * @module controllers/userController
 */

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user.
 * * This function handles user registration by hashing the password and saving
 * the new user to the database. It responds with a success message or an
 * error.
 * * @async
 * @function registerUser
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @returns {Promise<void>} A promise that resolves when the user is registered.
 */
exports.registerUser = async (req, res) => {
    // Destructure username, email, and password from the request body.
    const { username, email, password } = req.body;
    try {
        // Hash the user's password with a salt round of 10.
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new User instance with the provided details.
        const newUser = new User({ username, email, password: hashedPassword });
        // Save the new user to the database.
        await newUser.save();
        // Respond with a 201 Created status and a success message.
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        // If an error occurs, respond with a 500 Internal Server Error and a failure message.
        res.status(500).json({ error: 'Registration failed.' });
    }
};

/**
 * Logs in an existing user.
 * * This function handles user login by finding the user by their email,
 * comparing the provided password with the stored hashed password, and
 * generating a JWT token upon successful authentication.
 * * @async
 * @function loginUser
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @returns {Promise<void>} A promise that resolves when the user is logged in and a token is sent.
 */
exports.loginUser = async (req, res) => {
    // Destructure email and password from the request body.
    const { email, password } = req.body;
    try {
        // Find the user by their email in the database.
        const user = await User.findOne({ email });
        // If no user is found, return a 404 Not Found error.
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        // Compare the provided password with the hashed password stored in the database.
        const isMatch = await bcrypt.compare(password, user.password);
        // If the passwords do not match, return a 401 Unauthorized error.
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        // Sign a new JWT token with the user's ID, a secret key, and an expiration time of 1 hour.
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        // Respond with a 200 OK status and the generated token.
        res.status(200).json({ token });
    } catch (error) {
        // If an error occurs, respond with a 500 Internal Server Error and a failure message.
        res.status(500).json({ error: 'Login failed.' });
    }
};