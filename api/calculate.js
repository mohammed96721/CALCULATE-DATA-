module.exports = async (req, res) => {
    try {
        // 1. التحقق من نوع الطلب
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                error: 'الطريقة غير مسموحة. يسمح فقط بطلبات POST'
            });
        }

        // 2. التحقق من وجود البيانات
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'لم يتم تقديم أي بيانات'
            });
        }

        const formData = req.body;

        // 3. معالجة البيانات (الحسابات الإنشائية فقط)
        const calculations = {
            // الحسابات الأساسية
            totalLandArea: parseFloat(formData.land.area),
            totalBuiltArea: calculateBuiltArea(formData),
            
            // تكاليف البناء
            constructionCost: calculateConstructionCost(formData),
            finishingCost: calculateFinishingCost(formData),
            
            // الحسابات التفصيلية
            brickCount: calculateBrickCount(formData),
            concreteVolume: calculateConcreteVolume(formData),
            
            // ملخص التكاليف
            totalCost: 0, // سيتم حسابه لاحقا
            costPerSquareMeter: 0
        };

        // حساب التكلفة الإجمالية
        calculations.totalCost = calculations.constructionCost + calculations.finishingCost;
        calculations.costPerSquareMeter = calculations.totalCost / calculations.totalBuiltArea;

        // 4. إرسال الاستجابة بالبيانات المعالجة فقط
        res.status(200).json({
            success: true,
            message: 'تمت معالجة البيانات بنجاح',
            originalData: formData,
            calculations: calculations,
            timestamp: new Date().toISOString(),
            
            // إضافة إرشادات لإنشاء PDF في العميل
            pdfOptions: {
                title: "تقرير تكاليف البناء",
                author: "نظام الحسابات",
                direction: "rtl", // اتجاه النص من اليمين لليسار
                font: "Amiri" // خط عربي
            }
        });

    } catch (error) {
        console.error('حدث خطأ في معالجة البيانات:', error);
        res.status(500).json({
            success: false,
            error: 'حدث خطأ داخلي في الخادم',
            details: error.message
        });
    }
};

// ======================================
// دوال الحساب المساعدة (تبقى كما هي)
// ======================================

function calculateBuiltArea(data) {
    const groundFloorArea = data.land.area;
    const otherFloorsArea = data.land.area * (data.building.floors - 1);
    return groundFloorArea + otherFloorsArea;
}

function calculateConstructionCost(data) {
    const baseCost = data.land.area * data.building.floors * (data.prices.constructionRate || 150000);
    const foundationCost = data.land.area * (data.prices.foundationRate || 50000);
    return baseCost + foundationCost;
}

function calculateFinishingCost(data) {
    let cost = 0;
    cost += data.land.area * data.building.floors * (data.prices.flooring || 25000);
    cost += data.land.area * data.building.floors * (data.prices.wallInstallation || 15000);
    cost += data.land.area * data.building.floors * (data.prices.wallPainting || 8000);
    return cost;
}

function calculateBrickCount(data) {
    const brickSize = data.brickType === 'red' ? 0.002 : 0.0018;
    const wallArea = data.land.facadeWidth * data.building.groundFloorHeight * 4;
    return Math.ceil(wallArea / brickSize) * data.building.floors;
}

function calculateConcreteVolume(data) {
    const slabVolume = data.land.area * 0.2;
    const columnsVolume = data.building.floors * 4 * 0.3 * 0.3 * 3;
    return slabVolume + columnsVolume;
}
