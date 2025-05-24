module.exports = function calculate(data) {
    try {
        const totalArea = (data.land?.area || 0) * (data.building?.floors || 1);
        if (totalArea <= 0) {
            throw new Error('المساحة الإجمالية يجب أن تكون أكبر من 0');
        }

        const baseCostPerMeter = 100000; // دينار لكل متر مربع
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

        const brickCount = totalArea * 100;
        const concreteVolume = totalArea * 0.15;

        return {
            totalCost,
            costPerSquareMeter: totalCost / totalArea,
            brickCount,
            concreteVolume,
            doorsCount: 0,
            roofFenceCost: 0
        };
    } catch (error) {
        throw new Error(`خطأ في الحساب الأساسي: ${error.message}`);
    }
};
