// index.js (Cloudflare Worker)
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    try {
        if (request.method === 'POST' && request.url.includes('/api/calculate')) {
            const inputs = await request.json();
            console.log('البيانات الواردة:', JSON.stringify(inputs, null, 2));

            // التحقق من استيراد الملفات
            let routeCalculation, calculateModule, advancedCalculateModule;
            try {
                routeCalculation = require('./process').routeCalculation;
                calculateModule = require('./calculate');
                advancedCalculateModule = require('./advancedCalculate');
            } catch (error) {
                console.error('خطأ في استيراد الملفات:', error);
                throw new Error(`فشل في استيراد الملفات: ${error.message}`);
            }

            // التحقق من وجود routeCalculation
            if (!routeCalculation) {
                throw new Error('routeCalculation غير موجود');
            }

            const { module, data } = routeCalculation(inputs);
            console.log('الوجهة:', module);

            let result;
            if (module === 'advancedCalculate') {
                if (!advancedCalculateModule.calculate) {
                    throw new Error('دالة calculate غير موجودة في advancedCalculate');
                }
                result = await advancedCalculateModule.calculate(data);
            } else {
                if (!calculateModule.calculate) {
                    throw new Error('دالة calculate غير موجودة في calculate');
                }
                result = await calculateModule.calculate(data);
            }

            console.log('النتيجة:', result);
            return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return new Response('Not Found', { status: 404 });
    } catch (error) {
        console.error('خطأ في Worker:', error.stack);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
