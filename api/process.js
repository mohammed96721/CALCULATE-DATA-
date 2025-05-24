// api/process.js
export default async function handler(req, res) {
    const startTime = performance.now();
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        console.log('بداية معالجة الطلب');
        const inputs = req.body;
        console.log('البيانات الواردة:', JSON.stringify(inputs, null, 2));

        const routeCalculation = (await import('../process.js')).default;
        console.log('تم استيراد process.js');
        const calculateModule = await import('../calculate.js');
        console.log('تم استيراد calculate.js');
        const advancedCalculateModule = await import('../advancedCalculate.js');
        console.log('تم استيراد advancedCalculate.js');

        if (!routeCalculation) {
            throw new Error('routeCalculation غير موجود');
        }

        const { module, data } = routeCalculation(inputs);
        console.log('الوجهة:', module, 'البيانات الموجهة:', JSON.stringify(data, null, 2));

        let result;
        if (module === 'advancedCalculate') {
            if (!advancedCalculateModule.default.calculate) {
                throw new Error('دالة calculate غير موجودة في advancedCalculate');
            }
            console.log('بداية استدعاء advancedCalculate');
            result = await advancedCalculateModule.default.calculate(data);
            console.log('انتهى advancedCalculate');
        } else {
            if (!calculateModule.default.calculate) {
                throw new Error('دالة calculate غير موجودة في calculate');
            }
            console.log('بداية استدعاء calculate');
            result = await calculateModule.default.calculate(data);
            console.log('انتهى calculate');
        }

        console.log('النتيجة:', JSON.stringify(result, null, 2));
        const endTime = performance.now();
        console.log(`معالجة /api/process استغرقت ${endTime - startTime} ميلي ثانية`);
        return res.status(200).json(result);
    } catch (error) {
        console.error('خطأ في المعالجة:', error.stack);
        const endTime = performance.now();
        console.log(`معالجة /api/process فشلت بعد ${endTime - startTime} ميلي ثانية`);
        return res.status(500).json({ error: error.message });
    }
}
