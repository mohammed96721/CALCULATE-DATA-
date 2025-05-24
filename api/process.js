const express = require('express');
const cors = require('cors');
const validateInput = require('./middleware');
const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

const app = express();

// السماح بـ CORS لنطاق محدد
app.use(cors({
    origin: 'https://projects.vercel.app',
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// تطبيق التحقق
app.post('/', validateInput, (req, res) => {
    try {
        const data = req.body;

        // تحديد دالة الحساب
        req.handler = data.hasMap ? advancedCalculate : calculate;

        // التحقق من وجود الدالة
        if (typeof req.handler !== 'function') {
            throw new Error('دالة الحساب غير صالحة');
        }

        // استدعاء دالة الحساب
        const calculations = req.handler(data);

        // التحقق من صحة النتائج
        if (!calculations || typeof calculations.totalCost !== 'number') {
            throw new Error('نتائج الحساب غير صالحة');
        }

        res.status(200).json({
            success: true,
            originalData: data,
            calculations
        });
    } catch (error) {
        console.error('خطأ في المعالجة:', error.message, error.stack);
        res.status(500).json({
            success: false,
            error: `خطأ داخلي: ${error.message}`
        });
    }
});

module.exports = app;
