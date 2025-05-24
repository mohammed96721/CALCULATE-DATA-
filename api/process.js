const express = require('express');
const cors = require('cors');

const app = express();

// السماح بجميع المصادر مؤقتًا للاختبار
app.use(cors({
    origin: '*', // استبدل لاحقًا بنطاقك (مثل 'https://your-vercel-site-name.vercel.app')
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/', (req, res) => {
    try {
        const data = req.body;

        // التحقق من البيانات الأساسية
        if (!data.customer || !data.location || !data.land || !data.building || !data.prices) {
            return res.status(400).json({
                success: false,
                error: 'البيانات الأساسية مطلوبة'
            });
        }

        // منطق الحساب (مثال بسيط)
        const totalArea = data.land.area * data.building.floors;
        const baseCostPerMeter = 100000; // دينار لكل متر مربع
        let totalCost = totalArea * baseCostPerMeter;

        // إضافة تكاليف التشطيبات
        totalCost += totalArea * (data.prices.flooring + data.prices.wallInstallation + data.prices.wallPainting);
        totalCost += totalArea * data.prices.windowsDoors;

        // تكلفة محجر الدرج
        if (data.stairsRailingLength && data.prices.stairsRailing) {
            totalCost += data.stairsRailingLength * data.prices.stairsRailing;
        }

        // تكاليف إضافية
        if (data.building.hasGarden) totalCost += 5000000;
        if (data.building.hasPool) totalCost += 10000000;
        if (data.building.hasHVAC) totalCost += 7000000;
        if (data.building.hasElevator) totalCost += 15000000;
        if (data.building.hasFence) totalCost += 3000000;

        // حساب عدد الطوب وحجم الخرسانة
        const brickCount = totalArea * 100; // افتراضي
        const concreteVolume = totalArea * 0.15; // افتراضي

        res.status(200).json({
            success: true,
            originalData: data,
            calculations: {
                totalCost,
                costPerSquareMeter: totalCost / totalArea,
                brickCount,
                concreteVolume,
                doorsCount: data.technicalDetails ? (data.technicalDetails.externalDoors + data.technicalDetails.internalDoors) : 0,
                roofFenceCost: data.technicalDetails && data.technicalDetails.roofFenceLength ? data.technicalDetails.roofFenceLength * 50000 : 0
            }
        });
    } catch (error) {
        console.error('خطأ في المعالجة:', error.message);
        res.status(500).json({
            success: false,
            error: `خطأ داخلي: ${error.message}`
        });
    }
});

module.exports = app;
