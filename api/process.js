// api/process.js 
const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

// التصدير الافتراضي يجب أن يكون دالة (مطلوب لـ Vercel)
export default async function handler(req, res) {
  try {
    const data = req.body;
    console.log('البيانات المستلمة:', data);

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'البيانات غير صالحة' });
    }

    const hasMap = data.hasMap || false;
    const result = hasMap 
      ? await advancedCalculate.processAdvanced(data) 
      : await calculate.processBasic(data);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('حدث خطأ:', error);
    return res.status(500).json({ error: error.message });
  }
}
