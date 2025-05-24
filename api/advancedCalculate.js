// advancedCalculate.js
async function calculate(inputs) {
    try {
        if (!inputs || !inputs.technicalDetails) {
            throw new Error('البيانات أو التفاصيل الفنية غير موجودة');
        }
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
        throw new Error(`فشل في الحساب المتقدم: ${error.message}`);
    }
}

// تصدير افتراضي
export default { calculate };
