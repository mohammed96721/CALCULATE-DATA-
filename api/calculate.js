// إزالة استدعاء validationHelpers و logger
const calculateBuiltArea = (data) => {
    const groundFloorArea = data.land.area;
    const otherFloorsArea = data.land.area * (data.building.floors - 1);
    return groundFloorArea + otherFloorsArea;
};

const calculateConstructionCost = (data) => {
    const baseCost = data.land.area * data.building.floors * (data.prices.constructionRate || 150000);
    const foundationCost = data.land.area * (data.prices.foundationRate || 50000);
    return baseCost + foundationCost;
};

const calculateFinishingCost = (data) => {
    let cost = 0;
    cost += data.land.area * data.building.floors * data.prices.flooring;
    cost += data.land.area * data.building.floors * data.prices.wallInstallation;
    cost += data.land.area * data.building.floors * data.prices.wallPainting;
    
    if (data.stairsRailingLength && data.prices.stairsRailing) {
        cost += data.stairsRailingLength * data.prices.stairsRailing;
    }
    
    return cost;
};

const calculateBrickCount = (data) => {
    const brickSize = data.building.brickType === 'red' ? 0.002 : 0.0018;
    const wallArea = data.land.facadeWidth * data.building.groundFloorHeight * 4;
    return Math.ceil(wallArea / brickSize) * data.building.floors;
};

const calculateConcreteVolume = (data) => {
    const slabVolume = data.land.area * 0.2;
    const columnsVolume = data.building.floors * 4 * 0.3 * 0.3 * 3;
    
    if (data.building.concreteVolume) {
        return slabVolume + columnsVolume + data.building.concreteVolume;
    }
    return slabVolume + columnsVolume;
};

// المعالجة الرئيسية
module.exports = async (req, res) => {
    try {
        const formData = req.body;

        const calculations = {
            totalLandArea: formData.land.area,
            totalBuiltArea: calculateBuiltArea(formData),
            constructionCost: calculateConstructionCost(formData),
            finishingCost: calculateFinishingCost(formData),
            brickCount: calculateBrickCount(formData),
            concreteVolume: calculateConcreteVolume(formData),
            stairsCost: formData.prices.stairsRailing * (formData.stairsRailingLength || 0),
            facadeCost: formData.building.customFacade?.area 
                      ? formData.building.customFacade.area * formData.building.customFacade.price 
                      : 0,
            totalCost: 0,
            costPerSquareMeter: 0,
            costPerCubicMeter: 0
        };

        calculations.totalCost = 
            calculations.constructionCost +
            calculations.finishingCost +
            calculations.stairsCost +
            calculations.facadeCost;

        calculations.costPerSquareMeter = calculations.totalCost / calculations.totalBuiltArea;
        calculations.costPerCubicMeter = calculations.totalCost / (calculations.totalBuiltArea * formData.building.groundFloorHeight);

        res.status(200).json({
            success: true,
            message: 'تمت معالجة البيانات بنجاح',
            originalData: formData,
            calculations,
            timestamp: new Date().toISOString(),
            pdfOptions: {
                title: "تقرير تكاليف البناء",
                author: "النظام الآلي",
                direction: "rtl",
                font: "Tajawal",
                columns: [
                    { title: "البند", dataKey: "item" },
                    { title: "القيمة", dataKey: "value" }
                ],
                data: [
                    { item: "المساحة الكلية", value: `${calculations.totalBuiltArea} م²` },
                    { item: "التكلفة الإجمالية", value: `${calculations.totalCost.toLocaleString('ar-EG')} دينار` }
                ]
            }
        });

    } catch (error) {
        console.error('فشل في معالجة البيانات', {
            error: error.message,
            endpoint: '/calculate',
            user: req.user?.id
        });

        res.status(400).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
