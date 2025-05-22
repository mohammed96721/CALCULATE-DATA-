const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors'); // أضف هذه السطر
const app = express();

// تمكين CORS
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

app.post('/api/calculate', require('./api/calculate'));

module.exports.handler = serverless(app);
