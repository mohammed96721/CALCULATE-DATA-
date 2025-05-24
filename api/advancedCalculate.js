// advancedCalculate.js
async function calculate(inputs) {
    const startTime = performance.now();
    try {
        if (!inputs || !inputs.technicalDetails) {
            throw new Error('البيانات أو التفاصيل الفنية غير موجودة');
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

        const totalRoofArea = inputs.technicalDetails?.totalRoofArea || 0;
        const externalAreas = inputs.technicalDetails?.externalAreas || 0;
        const skylightsArea = inputs.technicalDetails?.skylightsArea || 0;
        const tiesLength = inputs.technicalDetails?.tiesLength || 0;
        const externalWalls24cm = inputs.technicalDetails?.externalWalls24cm || 0;
        const internalWalls24cm = inputs.technicalDetails?.internalWalls24cm || 0;
        const roofFenceLength = inputs.technicalDetails?.roofFenceLength || 0;

        // التحقق من القيم الكبيرة
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
            stairsRailingPrice > 1000000 ||
            totalRoofArea > 1000000 ||
            externalAreas > 1000000 ||
            skylightsArea > 1000000 ||
            tiesLength > 100000 ||
            externalWalls24cm > 1000000 ||
            internalWalls24cm > 1000000 ||
            roofFenceLength > 100000
        ) {
            throw new Error('القيم المدخلة كبيرة جدًا');
        }

        // حساب التكاليف
        const flooringCost = landArea * flooringPrice;
        const wallInstallationCost = landArea * floors * wallInstallationPrice;
        const wallPaintingCost = landArea * floors * wallPaintingPrice;
        const windowsDoorsCost = (rooms + bathrooms) * 2 * windowsDoorsPrice;
        const stairsRailingCost = stairsRailingLength * stairsRailingPrice;

        const roofCost = totalRoofArea * 15000;
        const externalAreasCost = externalAreas * 5000;
        const skylightsCost = skylightsArea * 20000;
        const tiesCost = tiesLength * 10000;
        const externalWallsCost = externalWalls24cm * floors * 12000;
        const internalWallsCost = internalWalls24cm * floors * 10000;
        const roofFenceCost = roofFenceLength * 8000;

        const totalCost = flooringCost + wallInstallationCost + wallPaintingCost + windowsDoorsCost +
                          stairsRailingCost + roofCost + externalAreasCost + skylightsCost +
                          tiesCost + externalWallsCost + internalWallsCost + roofFenceCost;

        const endTime = performance.now();
        console.log(`advancedCalculate استغرق ${endTime - startTime} ميلي ثانية`);

        return {
            totalCost,
            breakdown: {
                flooringCost,
                wallInstallationCost,
                wallPaintingCost,
                windowsDoorsCost,
                stairsRailingCost,
                roofCost,
                externalAreasCost,
                skylightsCost,
                tiesCost,
                externalWallsCost,
                internalWallsCost,
                roofFenceCost
            },
            details: 'حساب متقدم مع التفاصيل الفنية',
            technicalDetails: inputs.technicalDetails
        };
    } catch (error) {
        console.error('خطأ في advancedCalculate:', error);
        const endTime = performance.now();
        console.log(`advancedCalculate فشل بعد ${endTime - startTime} ميلي ثانية`);
        throw new Error(`فشل في الحساب المتقدم: ${error.message}`);
    }
}

export default { calculate };
