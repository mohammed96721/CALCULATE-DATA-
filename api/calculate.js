module.exports = function calculate(data) {
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

    const brickCount = totalArea * 100; // افتراضي
    const concreteVolume = totalArea * 0.15; // افتراضي

    return {
        totalCost,
        costPerSquareMeter: totalCost / totalArea,
        brickCount,
        concreteVolume,
        doorsCount: 0,
        roofFenceCost: 0
    };
};
