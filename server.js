const express = require('express');
const cors = require('cors');
const processData = require('./process');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // خدمة index.html

app.post('/api/process', (req, res) => {
  try {
    console.log('البيانات المستلمة في /api/process:', req.body); // تسجيل البيانات
    const data = req.body;
    if (!data || typeof data !== 'object') {
      throw new Error('البيانات المستلمة غير صالحة');
    }
    const result = processData.processData(data);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('خطأ في الخادم:', error.stack); // تسجيل تفاصيل الخطأ
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`الخادم يعمل على http://localhost:${port}`);
});
