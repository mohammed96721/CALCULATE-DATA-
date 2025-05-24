const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const middleware = require('./handlers/middleware');

dotenv.config();
const app = express();

app.use(cors({
    origin: 'https://your-vercel-site-name.vercel.app', // استبدل بالنطاق الفعلي
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`طلب وارد: ${req.method} ${req.url}`, {
        body: JSON.stringify(req.body, null, 2),
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    next();
});

app.post('/', middleware, (req, res) => {
    try {
        if (!req.handler) {
            return res.status(500).json({
                success: false,
                error: 'لم يتم تحديد معالج الطلب'
            });
        }
        req.handler(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `خطأ داخلي: ${error.message}`
        });
    }
});

app.use((err, req, res, next) => {
    console.error('خطأ عام:', err.message);
    res.status(500).json({
        success: false,
        error: 'حدث خطأ غير متوقع'
    });
});

module.exports = app;
