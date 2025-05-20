const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/calculate', require('./api/calculate'));

module.exports.handler = serverless(app);