// calculate.js
async function calculate(inputs) {
    try {
        // التحقق من وجود البيانات
        if (!inputs) {
            throw new Error('البيانات المرسلة فارغة');
        }

        // استخراج القيم مع قيم افتراضية لتجنب الأخطاء
        const landArea = inputs.land?.area || 0;
        const floors = inputs.building?.floors || 0;
        const rooms = inputs.building?.rooms || 0;
        const bathrooms = inputs.building?.bathrooms || 0;
        const stairsRailingLength = inputs.stairsRailingLength || 0;

        const flooringPrice = inputs.prices?.flooring || 0;
        const wallInstallationPrice = inputs.prices?.wallInstallation || 0;
        const wallPaintingPrice = inputs.prices?.wallPainting || 0;
        const windowsDoorsPrice = inputs.prices?.windowsDoors || 0;
        const stairsRailingPrice = inputs.prices?.stairsRailing || 0;

        // حساب التكاليف الأساسية
        const flooringCost = landArea * flooringPrice;
        const wallInstallationCost = landArea * floors * wallInstallationPrice;
        const wallPaintingCost = landArea * floors * wallPaintingPrice;
        const windowsDoorsCost = (rooms + bathrooms) * 2 * windowsDoorsPrice; // افتراض: متر مربع لكل غرفة/حمام
        const stairsRailingCost = stairsRailingLength * stairsRailingPrice;

        // التكلفة الإجمالية
        const totalCost = flooringCost + wallInstallationCost + wallPaintingCost + windowsDoorsCost + stairsRailingCost;

        return {
            totalCost,
            breakdown: {
                flooringCost,
                wallInstallationCost,
                wallPaintingCost,
                windowsDoorsCost,
                stairsRailingCost
            },
            details: 'حساب بسيط بدون تفاصيل فنية'
        };
    } catch (error) {
        console.error('خطأ في calculate:', error);
        throw new Error(`فشل في الحساب البسيط: ${error.message}`);
    }
}

module.exports = { calculate };
