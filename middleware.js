const Joi = require('joi');
const calculate = require('./api/calculate');
const advancedCalculate = require('./api/advancedCalculate');

const validateRequestData = (data) => {
    const schema = Joi.object({
        customer: Joi.object({
            name: Joi.string().min(2).max(100).required()
                .messages({
                    'string.empty': 'اسم الزبون مطلوب',
                    'string.min': 'الاسم يجب أن يكون 2 أحرف على الأقل'
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
        stairsRailingLength: Joi.number().min(0).default(0),
        hasMap: Joi.boolean().required(),
        technicalDetails: Joi.when('hasMap', {
            is: true,
            then: Joi.object({
                totalRoofArea: Joi.number().positive().required(),
                externalAreas: Joi.number().positive().required(),
                skylightsArea: Joi.number().positive().required(),
                tiesLength: Joi.number().positive().required(),
                invertedBeams: Joi.number().positive().required(),
                externalWalls24cm: Joi.number().positive().required(),
                internalWalls24cm: Joi.number().positive().required(),
                roofFenceLength: Joi.number().positive().required(),
                externalDoors: Joi.number().integer().min(0).required(),
                internalDoors: Joi.number().integer().min(0).required(),
                facadeWindowsDoorsArea: Joi.number().positive().required(),
                skylightWindowsDoorsArea: Joi.number().positive().required(),
                secondaryCeilingsArea: Joi.number().positive().required(),
                decorativeWallsArea: Joi.number().positive().required(),
                claddingWallsArea: Joi.number().positive().required()
            }).required(),
            otherwise: Joi.forbidden()
        })
    }).options({ abortEarly: false });

    const { error } = schema.validate(data);
    if (error) {
        const errors = error.details.map(err => err.message);
        throw new Error(errors.join(' | '));
    }
};

module.exports = (req, res, next) => {
    try {
        // التحقق من البيانات
        validateRequestData(req.body);

        // تحديد المعالج بناءً على hasMap
        req.handler = req.body.hasMap ? advancedCalculate : calculate;

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
