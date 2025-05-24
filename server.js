// server.js
const express = require('express');
const { routeCalculation } = require('./process');
const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

const app = express();
app.use(express.json());

app.post('/api/calculate', async (req, res) => {
    try {
        const inputs = req.body;
        console.log('البيانات الواردة:', JSON.stringify(inputs, null, 2));
        if (!inputs) {
            throw new Error('البيانات المرسلة فارغة');
        }
        const { module, data } = routeCalculation(inputs);
        console.log('الوجهة:', module);
        let result;
        if (module === 'advancedCalculate') {
            result = await advancedCalculate.calculate(data);
        } else {
            result = await calculate.calculate(data);
        }
        console.log('النتيجة:', result);
        res.json(result);
    } catch (error) {
        console.error('خطأ في معالجة الطلب:', error.stack);
        res.status(500).json({ error: error.message });
    }
});

app.use(express.static('public'));
app.listen(3000, () => {
    console.log('الخادم يعمل على http://localhost:3000');
});
