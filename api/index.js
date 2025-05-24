// api/process.js (لـ Vercel)
export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const inputs = req.body;
        console.log('البيانات الواردة:', JSON.stringify(inputs, null, 2));

        // استيراد الدوال
        const routeCalculation = (await import('../process.js')).default;
        const calculateModule = await import('../calculate.js');
        const advancedCalculateModule = await import('../advancedCalculate.js');

        if (!routeCalculation) {
            throw new Error('routeCalculation غير موجود');
        }

        const { module, data } = routeCalculation(inputs);
        console.log('الوجهة:', module);

        let result;
        if (module === 'advancedCalculate') {
            if (!advancedCalculateModule.default.calculate) {
                throw new Error('دالة calculate غير موجودة في advancedCalculate');
            }
            result = await advancedCalculateModule.default.calculate(data);
        } else {
            if (!calculateModule.default.calculate) {
                throw new Error('دالة calculate غير موجودة في calculate');
            }
            result = await calculateModule.default.calculate(data);
        }

        console.log('النتيجة:', result);
        return res.status(200).json(result);
    } catch (error) {
        console.error('خطأ في المعالجة:', error.stack);
        return res.status(500).json({ error: error.message });
    }
}
