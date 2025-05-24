// api/process.js
const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

// يجب أن يكون التصدير الافتراضي دالة (لتوافق مع Vercel)
export default async function handler(req, res) {
  try {
    const data = req.body;
    console.log('البيانات المستلمة:', data);

    if (!data || typeof data !== 'object') {
      throw new Error('البيانات غير صالحة');
    }

    const hasMap = data.hasMap || false;
    const result = hasMap 
      ? advancedCalculate.processAdvanced(data) 
      : calculate.processBasic(data);

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('حدث خطأ:', error);
    res.status(500).json({ error: error.message });
  }
}
