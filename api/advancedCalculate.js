const calculateBuiltArea = (data) => {
    // استخدام التفاصيل الفنية مع الأخذ بعين الاعتبار البيانات الأساسية
    const roofArea = data.technicalDetails.totalRoofArea || data.land.area;
    const externalAreas = data.technicalDetails.externalAreas || 0;
    const basementArea = data.building.basement?.ceilingArea || 0;
    return (roofArea * data.building.floors) + externalAreas + basementArea;
};

const calculateConstructionCost = (data) => {
    // تكلفة البناء بناءً على التفاصيل الفنية والبيانات الأساسية
    const baseCost = data.technicalDetails.totalRoofArea * data.building.floors * (data.prices.constructionRate || 200000);
    const foundationCost = data.land.area * (data.prices.foundationRate || 60000);
    const tiesCost = data.technicalDetails.tiesLength * 10000; // تكلفة الأعمدة
    const beamsCost = data.technicalDetails.invertedBeams * 15000; // تكلفة الكمرات
    const basementCost = data.building.basement?.price * data.building.basement?.ceilingArea || 0;
    return baseCost + foundationCost + tiesCost + beamsCost + basementCost;
};

const calculateFinishingCost = (data) => {
    let cost = 0;
    // تكاليف التشطيب بناءً على التفاصيل الفنية والبيانات الأساسية
    cost += data.technicalDetails.totalRoofArea * data.building.floors * data.prices.flooring;
    cost += (data.technicalDetails.externalWalls24cm + data.technicalDetails.internalWalls24cm) * data.prices.wallInstallation;
    cost += data.technicalDetails.totalRoofArea * data.building.floors * data.prices.wallPainting;
    cost += (data.technicalDetails.facadeWindowsDoorsArea + data.technicalDetails.skylightWindowsDoorsArea) * data.prices.windowsDoors;
    cost += data.technicalDetails.secondaryCeilingsArea * 20000; // تكلفة الأسقف الثانوية
    cost += data.technicalDetails.decorativeWallsArea * 30000; // تكلفة الجدران الزخرفية
    cost += data.technicalDetails.claddingWallsArea * 25000; // تكلفة التكسية
    cost += (data.building.internalWalls?.area * data.building.internalWalls?.price) || 0;
    
    if (data.stairsRailingLength && data.prices.stairsRailing) {
        cost += data.stairsRailingLength * data.prices.stairsRailing;
    }
    
    if (data.building.hasGarden) cost += 50000; // تكلفة الحديقة
    if (data.building.hasPool) cost += 100000; // تكلفة المسبح
    if (data.building.hasHVAC) cost += 75000; // تكلفة التكييف
    if (data.building.hasElevator) cost += 120000; // تكلفة المصعد
    if (data.building.hasFence) cost += 30000; // تكلفة السياج
    
    return cost;
};

const calculateBrickCount = (data) => {
    const brickSize = data.building.brickType === 'red' ? 0.002 : data.building.brickType === 'yellow' ? 0.0018 : (data.building.brickDetails?.width * data.building.brickDetails?.length * data.building.brickDetails?.height) || 0.0018;
    const wallArea = data.technicalDetails.externalWalls24cm + data.technicalDetails.internalWalls24cm + (data.building.internalWalls?.area || 0);
    return Math.ceil(wallArea / brickSize) * data.building.floors;
};

const calculateConcreteVolume = (data) => {
    const slabVolume = data.technicalDetails.totalRoofArea * 0.15; // سمك الأسقف
    const columnsVolume = data.building.floors * 4 * 0.3 * 0.3 * 3;
    const tiesVolume = data.technicalDetails.tiesLength * 0.2 * 0.2;
    const beamsVolume = data.technicalDetails.invertedBeams * 0.3 * 0.3;
    const basementVolume = data.building.basement?.ceilingArea * 0.2 || 0;
    
    if (data.building.concreteVolume) {
        return slabVolume + columnsVolume + tiesVolume + beamsVolume + basementVolume + data.building.concreteVolume;
    }
    return slabVolume + columnsVolume + tiesVolume + beamsVolume + basementVolume;
};

module.exports = async (req, res) => {
    try {
        const formData = req.body;

        if (!formData.hasMap || !formData.technicalDetails) {
            return res.status(400).json({
                success: false,
                error: 'البيانات الفنية مطلوبة لهذا المسار'
            });
        }

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
            costPerCubicMeter: 0,
            doorsCount: formData.technicalDetails.externalDoors + formData.technicalDetails.internalDoors,
            roofFenceCost: formData.technicalDetails.roofFenceLength * 5000,
            facadeTypeCost: formData.building.facadeType === 'luxury' ? 100000 : formData.building.facadeType === 'simple' ? 50000 : formData.building.facadeType === 'custom' ? 75000 : 30000,
            roomsCount: formData.building.rooms,
            bathroomsCount: formData.building.bathrooms
        };

        calculations.totalCost = 
            calculations.constructionCost +
            calculations.finishingCost +
            calculations.stairsCost +
            calculations.facadeCost +
            calculations.roofFenceCost +
            calculations.facadeTypeCost;

        calculations.costPerSquareMeter = calculations.totalCost / calculations.totalBuiltArea;
        calculations.costPerCubicMeter = calculations.totalCost / (calculations.totalBuiltArea * formData.building.groundFloorHeight);

        res.status(200).json({
            success: true,
            message: 'تمت معالجة البيانات الدقيقة بنجاح',
            originalData: formData,
            calculations,
            timestamp: new Date().toISOString(),
            pdfOptions: {
                title: "تقرير تكاليف البناء (دقيق)",
                author: "النظام الآلي",
                direction: "rtl",
                font: "Tajawal",
                columns: [
                    { title: "البند", dataKey: "item" },
                    { title: "القيمة", dataKey: "value" }
                ],
                data: [
                    { item: "المساحة الكلية", value: `${calculations.totalBuiltArea} م²` },
                    { item: "التكلفة الإجمالية", value: `${calculations.totalCost.toLocaleString('ar-EG')} دينار` },
                    { item: "عدد الطوب", value: `${calculations.brickCount.toLocaleString('ar-EG')}` },
                    { item: "حجم الخرسانة", value: `${calculations.concreteVolume.toFixed(2)} م³` },
                    { item: "عدد الأبواب", value: `${calculations.doorsCount}` },
                    { item: "تكلفة سياج السطح", value: `${calculations.roofFenceCost.toLocaleString('ar-EG')} دينار` },
                    { item: "عدد الغرف", value: `${calculations.roomsCount}` },
                    { item: "عدد الحمامات", value: `${calculations.bathroomsCount}` }
                ]
            }
        });

    } catch (error) {
        console.error('فشل في معالجة البيانات الدقيقة', {
            error: error.message,
            endpoint: '/advanced-calculate',
            user: req.user?.id
        });

        res.status(400).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
