/**
 * @fileoverview This file exports a function to initialize and configure an Express server.
 * @module config/server
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * Initializes and configures an Express application instance.
 * @function initServer
 * @returns {object} The configured Express application instance.
 */
const initServer = () => {
    // Create a new Express application instance.
    const app = express();

    // Enable Cross-Origin Resource Sharing (CORS) for all routes.
    app.use(cors());

    // Use body-parser middleware to parse incoming JSON request bodies.
    app.use(bodyParser.json());

    // Return the configured application instance.
    return app;
};

module.exports = initServer;