module.exports = function advancedCalculate(data) {
    try {
        const totalArea = ((data.technicalDetails?.totalRoofArea || data.land?.area || 0) * (data.building?.floors || 1));
        if (totalArea <= 0) {
            throw new Error('المساحة الإجمالية يجب أن تكون أكبر من 0');
        }

        const baseCostPerMeter = 150000; // دينار لكل متر مربع
        let totalCost = totalArea * baseCostPerMeter;

        // إضافة تكاليف التشطيبات
        totalCost += totalArea * (
            (data.prices?.flooring || 0) + 
            (data.prices?.wallInstallation || 0) + 
            (data.prices?.wallPainting || 0)
        );
        totalCost += totalArea * (data.prices?.windowsDoors || 0);

        // تكلفة محجر الدرج
        if (data.stairsRailingLength > 0 && data.prices?.stairsRailing > 0) {
            totalCost += data.stairsRailingLength * data.prices.stairsRailing;
        }

        // تكاليف إضافية
        if (data.building?.hasGarden) totalCost += 5000000;
        if (data.building?.hasPool) totalCost += 10000000;
        if (data.building?.hasHVAC) totalCost += 7000000;
        if (data.building?.hasElevator) totalCost += 15000000;
        if (data.building?.hasFence) totalCost += 3000000;

        const brickCount = totalArea * 120;
        const concreteVolume = totalArea * 0.2;
        const doorsCount = (data.technicalDetails?.externalDoors || 0) + (data.technicalDetails?.internalDoors || 0);
        const roofFenceCost = (data.technicalDetails?.roofFenceLength || 0) * 50000;

        return {
            totalCost,
            costPerSquareMeter: totalCost / totalArea,
            brickCount,
            concreteVolume,
            doorsCount,
            roofFenceCost
        };
    } catch (error) {
        throw new Error(`خطأ في الحساب المتقدم: ${error.message}`);
    }
};
