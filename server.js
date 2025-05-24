const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const middleware = require('./middleware');
const calculate = require('./api/calculate');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/calculate', middleware, calculate);

module.exports.handler = serverless(app);
