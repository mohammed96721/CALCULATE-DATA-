// calculate.js
async function calculate(inputs) {
    const startTime = performance.now();
    try {
        if (!inputs) {
            throw new Error('البيانات المرسلة فارغة');
        }

        // استخراج القيم مع قيم افتراضية
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

        // التحقق من القيم الكبيرة لتجنب الحسابات البطيئة
        if (
            landArea > 1000000 ||
            floors > 100 ||
            rooms > 1000 ||
            bathrooms > 1000 ||
            stairsRailingLength > 10000 ||
            flooringPrice > 1000000 ||
            wallInstallationPrice > 1000000 ||
            wallPaintingPrice > 1000000 ||
            windowsDoorsPrice > 1000000 ||
            stairsRailingPrice > 1000000
        ) {
            throw new Error('القيم المدخلة كبيرة جدًا');
        }

        // حساب التكاليف
        const flooringCost = landArea * flooringPrice;
        const wallInstallationCost = landArea * floors * wallInstallationPrice;
        const wallPaintingCost = landArea * floors * wallPaintingPrice;
        const windowsDoorsCost = (rooms + bathrooms) * 2 * windowsDoorsPrice;
        const stairsRailingCost = stairsRailingLength * stairsRailingPrice;

        const totalCost = flooringCost + wallInstallationCost + wallPaintingCost + windowsDoorsCost + stairsRailingCost;

        const endTime = performance.now();
        console.log(`calculate استغرق ${endTime - startTime} ميلي ثانية`);

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
        const endTime = performance.now();
        console.log(`calculate فشل بعد ${endTime - startTime} ميلي ثانية`);
        throw new Error(`فشل في الحساب البسيط: ${error.message}`);
    }
}

export default { calculate };
