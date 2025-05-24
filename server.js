const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const middleware = require('./middleware');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/process', middleware, (req, res) => {
    if (!req.handler) {
        return res.status(500).json({
            success: false,
            error: 'لم يتم تحديد معالج الطلب',
            timestamp: new Date().toISOString()
        });
    }
    req.handler(req, res);
});

module.exports.handler = serverless(app);
