const express = require('express');
const cors = require('cors');
const validateInput = require('./middleware');
const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

const app = express();

// السماح بجميع المصادر مؤقتًا للاختبار
app.use(cors({
    origin: '*', // استبدل لاحقًا بنطاقك (مثل 'https://your-vercel-site-name.vercel.app')
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// تطبيق التحقق
app.post('/', validateInput, (req, res) => {
    try {
        const data = req.body;

        // تحديد دالة الحساب بناءً على hasMap
        req.handler = data.hasMap ? advancedCalculate : calculate;

        // استدعاء دالة الحساب
        const calculations = req.handler(data);

        res.status(200).json({
            success: true,
            originalData: data,
            calculations
        });
    } catch (error) {
        console.error('خطأ في المعالجة:', error.message);
        res.status(500).json({
            success: false,
            error: `خطأ داخلي: ${error.message}`
        });
    }
});

module.exports = app;
