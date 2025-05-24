// index.js (Cloudflare Worker)
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    try {
        if (request.method === 'POST' && request.url.includes('/api/calculate')) {
            const inputs = await request.json();
            console.log('البيانات الواردة:', JSON.stringify(inputs, null, 2));

            // استيراد الدوال
            const routeCalculation = (await import('./process.js')).default;
            const calculateModule = await import('./calculate.js');
            const advancedCalculateModule = await import('./advancedCalculate.js');

            // التحقق من وجود routeCalculation
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
