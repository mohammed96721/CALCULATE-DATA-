const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

function processData(data) {
  try {
    const hasMap = data.hasMap || false;
    return hasMap ? advancedCalculate.processAdvanced(data) : calculate.processBasic(data);
  } catch (error) {
    throw new Error(`خطأ في توجيه البيانات: ${error.message}`);
  }
}

module.exports = { processData };
