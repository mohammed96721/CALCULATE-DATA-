const calculate = require('./calculate'); // نفس المجلد (api/)
const advancedCalculate = require('./advancedCalculate'); // نفس المجلد (api/)

function processData(data) {
  try {
    console.log('البيانات في process.js:', data); // تسجيل
    if (!data || typeof data !== 'object') {
      throw new Error('البيانات غير صالحة');
    }
    const hasMap = data.hasMap || false;
    console.log('hasMap:', hasMap); // تسجيل
    return hasMap ? advancedCalculate.processAdvanced(data) : calculate.processBasic(data);
  } catch (error) {
    console.error('خطأ في process.js:', error.stack);
    throw new Error(`خطأ في توجيه البيانات: ${error.message}`);
  }
}

module.exports = { processData };
