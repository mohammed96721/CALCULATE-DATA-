const express = require('express');
const cors = require('cors');
const processData = require('./process');

const app = express();
const port = process.env.PORT || 3000; // يدعم منصات الإنتاج مثل Vercel

app.use(express.json());
app.use(cors()); // دعم CORS للواجهة
app.use(express.static('public')); // خدمة index.html

app.post('/api/process', (req, res) => {
  try {
    const data = req.body;
    const result = processData.processData(data);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('خطأ في الخادم:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`الخادم يعمل على المنفذ ${port}`);
});
