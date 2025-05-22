const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/calculate', require('./api/calculate'));

module.exports.handler = serverless(app);
