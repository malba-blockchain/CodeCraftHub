/**
 * @fileoverview This file exports a function to connect to a MongoDB database.
 * @module config/db
 */

const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database.
 * * This asynchronous function connects to the MongoDB database using the URI
 * provided in the environment variable `MONGO_URI`. It handles both successful
 * connection and potential errors.
 * * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @throws {Error} If the MongoDB connection fails, the process exits with a status code of 1.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the MONGO_URI from environment variables.
        await mongoose.connect(process.env.MONGO_URI, {
            // Use the new URL parser to avoid deprecation warnings.
            useNewUrlParser: true,
            // Use the new server discovery and monitoring engine.
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        // Log the error if the connection fails.
        console.error('MongoDB connection failed:', error);
        // Exit the process with a failure code.
        process.exit(1);
    }
};

module.exports = connectDB;