const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const middleware = require('./middleware');

dotenv.config();
const app = express();

// إعدادات CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-vercel-site-name.vercel.app' : '*',
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

// تحليل جسم الطلبات كـ JSON
app.use(express.json());

// تسجيل الطلبات الواردة
app.use((req, res, next) => {
    console.log(`طلب وارد: ${req.method} ${req.url}`, {
        body: req.body,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    next();
});

// نقطة النهاية الرئيسية
app.post('/', middleware, (req, res) => {
    try {
        if (!req.handler) {
            console.error('خطأ: لم يتم تحديد المعالج', {
                ip: req.ip,
                body: req.body,
                timestamp: new Date().toISOString()
            });
            return res.status(500).json({
                success: false,
                error: 'لم يتم تحديد معالج الطلب',
                timestamp: new Date().toISOString()
            });
        }

        console.log('تمرير الطلب إلى المعالج:', req.body.hasMap ? 'advancedCalculate' : 'calculate');
        req.handler(req, res);
    } catch (error) {
        console.error('فشل في معالجة الطلب:', {
            ip: req.ip,
            error: error.message,
            body: req.body,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({
            success: false,
            error: `خطأ داخلي في الخادم: ${error.message}`,
            timestamp: new Date().toISOString()
        });
    }
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
    console.error('خطأ عام في الخادم:', {
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    res.status(500).json({
        success: false,
        error: 'حدث خطأ غير متوقع في الخادم',
        timestamp: new Date().toISOString()
    });
});

// تصدير الوظيفة لـ Vercel
module.exports = app;
