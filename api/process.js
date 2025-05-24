// process.js
function routeCalculation(inputs) {
    // التحقق مما إذا كان قسم التفاصيل الفنية مفتوحًا (غير مخفي)
    const hasMap = inputs.hasMap;

    // إذا كان لديه خريطة، التحقق من إدخال البيانات في حقول التفاصيل الفنية
    if (hasMap && inputs.technicalDetails) {
        // التحقق مما إذا كانت هناك بيانات مدخلة في الحقول
        const technicalDetails = inputs.technicalDetails;
        const hasTechnicalData = Object.values(technicalDetails).some(value => value !== 0 && value !== '');

        if (hasTechnicalData) {
            // إذا كان هناك بيانات، توجيه إلى advancedCalculate.js
            return { module: 'advancedCalculate', data: inputs };
        }
    }

    // إذا لم يكن هناك خريطة أو لم يتم إدخال بيانات، توجيه إلى calculate.js
    return { module: 'calculate', data: inputs };
}

module.exports = { routeCalculation };
