const Joi = require('joi');

// تحقق من صحة البيانات (Joi Validation)
const validateRequestData = (data) => {
    const schema = Joi.object({
        customer: Joi.object({
            name: Joi.string().min(3).max(100).required()
                .messages({
                    'string.empty': 'اسم الزبون مطلوب',
                    'string.min': 'الاسم يجب أن يكون 3 أحرف على الأقل'
                }),
            phone: Joi.string().pattern(/^[0-9]+$/).required()
                .messages({
                    'string.pattern.base': 'رقم الهاتف يجب أن يحتوي أرقامًا فقط'
                })
        }).required(),
        location: Joi.object({
            governorate: Joi.string().valid(
                'baghdad', 'basra', 'najaf', 'karbala', 'erbil',
                'sulaymaniyah', 'duhok', 'kirkuk', 'mosul', 'anbar',
                'saladin', 'diyala', 'wasit', 'babil', 'qadisiyah',
                'muthanna', 'dhi_qar', 'maysan'
            ).required(),
            area: Joi.string().min(2).max(100).required()
        }).required(),
        land: Joi.object({
            area: Joi.number().positive().required(),
            facadeWidth: Joi.number().positive().required()
        }).required(),
        building: Joi.object({
            floors: Joi.number().integer().min(1).max(50).required(),
            rooms: Joi.number().integer().min(1).required(),
            bathrooms: Joi.number().integer().min(1).required(),
            groundFloorHeight: Joi.number().positive().required(),
            otherFloorsHeight: Joi.number().positive().required(),
            brickType: Joi.string().valid('yellow', 'red', 'other').required(),
            woodType: Joi.string().valid('plywood', 'regular').required(),
            facadeType: Joi.string().valid('economy', 'simple', 'luxury', 'custom').required(),
            hasGarden: Joi.boolean().default(false),
            hasPool: Joi.boolean().default(false),
            hasHVAC: Joi.boolean().default(false),
            hasElevator: Joi.boolean().default(false),
            hasFence: Joi.boolean().default(false),
            brickDetails: Joi.object({
                width: Joi.number().positive(),
                length: Joi.number().positive(),
                height: Joi.number().positive(),
                density: Joi.number().positive()
            }).optional(),
            concreteVolume: Joi.number().positive().optional(),
            apartmentsCount: Joi.number().integer().min(0).optional(),
            customFacade: Joi.object({
                area: Joi.number().positive(),
                price: Joi.number().positive()
            }).optional(),
            internalWalls: Joi.object({
                area: Joi.number().positive(),
                price: Joi.number().positive()
            }).optional(),
            basement: Joi.object({
                floors: Joi.number().integer().min(0),
                ceilingArea: Joi.number().positive(),
                price: Joi.number().positive()
            }).optional()
        }).required(),
        prices: Joi.object({
            flooring: Joi.number().positive().required(),
            wallInstallation: Joi.number().positive().required(),
            wallPainting: Joi.number().positive().required(),
            windowsDoors: Joi.number().positive().required(),
            stairsRailing: Joi.number().positive().default(0)
        }).required(),
        technicalDetails: Joi.object({
            totalRoofArea: Joi.number().positive(),
            externalAreas: Joi.number().positive(),
            skylightsArea: Joi.number().positive(),
            tiesLength: Joi.number().positive(),
            invertedBeams: Joi.number().positive(),
            externalWalls24cm: Joi.number().positive(),
            internalWalls24cm: Joi.number().positive(),
            roofFenceLength: Joi.number().positive(),
            externalDoors: Joi.number().integer().min(0),
            internalDoors: Joi.number().integer().min(0),
            facadeWindowsDoorsArea: Joi.number().positive(),
            skylightWindowsDoorsArea: Joi.number().positive(),
            secondaryCeilingsArea: Joi.number().positive(),
            decorativeWallsArea: Joi.number().positive(),
            claddingWallsArea: Joi.number().positive()
        }).optional()
    }).options({ abortEarly: false });

    const { error } = schema.validate(data);
    if (error) {
        const errors = error.details.map(err => err.message);
        throw new Error(errors.join(' | '));
    }
};

// Middleware الرئيسي
module.exports = (req, res, next) => {
    try {
        // التحقق من صحة البيانات فقط
        validateRequestData(req.body);
        
        next();
        
    } catch (error) {
        console.error('فشل التحقق:', {
            ip: req.ip,
            error: error.message,
            body: req.body
        });
        
        res.status(400).json({ 
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
