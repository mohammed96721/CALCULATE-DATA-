const express = require('express');
const cors = require('cors');
const processData = require('./api/process');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.post('/api/process', (req, res) => {
  try {
    console.log('البيانات المستلمة في /api/process:', req.body);
    const data = req.body;
    if (!data || typeof data !== 'object') {
      throw new Error('البيانات المستلمة غير صالحة');
    }
    const result = processData.processData(data);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('خطأ في الخادم:', error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`الخادم يعمل على http://localhost:${port}`);
});

// تصدير لـ Vercel
module.exports = app;
