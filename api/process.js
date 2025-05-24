// api/process.js
export default async function handler(req, res) {
    const startTime = performance.now();
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
        console.log('بداية معالجة الطلب');
        const inputs = req.body;
        console.log('حجم البيانات الواردة:', JSON.stringify(inputs).length, 'بايت');

        const importStart = performance.now();
        const routeCalculation = (await import('../routeCalculation.js')).default;
        const importEnd = performance.now();
        console.log(`استيراد routeCalculation.js استغرق ${importEnd - importStart} ميلي ثانية`);

        const calculateImportStart = performance.now();
        const calculateModule = await import('./calculate.js');
        const calculateImportEnd = performance.now();
        console.log(`استيراد calculate.js استغرق ${calculateImportEnd - calculateImportStart} ميلي ثانية`);

        const advancedImportStart = performance.now();
        const advancedCalculateModule = await import('./advancedCalculate.js');
        const advancedImportEnd = performance.now();
        console.log(`استيراد advancedCalculate.js استغرق ${advancedImportEnd - advancedImportStart} ميلي ثانية`);

        if (!routeCalculation) {
            throw new Error('routeCalculation غير موجود');
        }

        const routeStart = performance.now();
        const { module, data } = routeCalculation(inputs);
        const routeEnd = performance.now();
        console.log(`routeCalculation استغرق ${routeEnd - routeStart} ميلي ثانية`);
        console.log('الوجهة:', module);

        let result;
        if (module === 'advancedCalculate') {
            if (!advancedCalculateModule.default.calculate) {
                throw new Error('دالة calculate غير موجودة في advancedCalculate');
            }
            console.log('بداية استدعاء advancedCalculate');
            const calcStart = performance.now();
            result = await advancedCalculateModule.default.calculate(data);
            const calcEnd = performance.now();
            console.log(`advancedCalculate استغرق ${calcEnd - calcStart} ميلي ثانية`);
        } else {
            if (!calculateModule.default.calculate) {
                throw new Error('دالة calculate غير موجودة في calculate');
            }
            console.log('بداية استدعاء calculate');
            const calcStart = performance.now();
            result = await calculateModule.default.calculate(data);
            const calcEnd = performance.now();
            console.log(`calculate استغرق ${calcEnd - calcStart} ميلي ثانية`);
        }

        console.log('النتيجة:', JSON.stringify(result).length, 'بايت');
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
