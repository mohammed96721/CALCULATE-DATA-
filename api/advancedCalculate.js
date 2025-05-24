module.exports = function advancedCalculate(data) {
    const totalArea = (data.technicalDetails?.totalRoofArea || data.land.area) * data.building.floors;
    const baseCostPerMeter = 150000; // دينار لكل متر مربع
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

    const brickCount = totalArea * 120; // افتراضي
    const concreteVolume = totalArea * 0.2; // افتراضي
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
};
