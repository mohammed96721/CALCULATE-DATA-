const express = require('express');
const cors = require('cors');
const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

const app = express();
const port = process.env.PORT || 3000;

// Middleware لدعم JSON وCORS
app.use(express.json());
app.use(cors());

// نقطة نهاية لمعالجة البيانات
app.post('/api/process', (req, res) => {
  try {
    const data = req.body;
    const hasMap = data.hasMap || false;

    // توجيه البيانات بناءً على hasMap
    const result = hasMap ? advancedCalculate.processAdvanced(data) : calculate.processBasic(data);

    // إرجاع النتيجة
    res.status(200).json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('خطأ في الخادم:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`الخادم يعمل على http://localhost:${port}`);
});
