const Joi = require('joi');
const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

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
            facadeWidth: Joi.number().positive().optional()
        }).required(),
        building: Joi.object({
            floors: Joi.number().integer().min(1).max(50).required(),
            rooms: Joi.number().integer().min(1).required(),
            bathrooms: Joi.number().integer().min(1).required(),
            groundFloorHeight: Joi.number().positive().optional(),
            otherFloorsHeight: Joi.number().positive().optional(),
            brickType: Joi.string().valid('yellow', 'red', 'other').optional(),
            woodType: Joi.string().valid('plywood', 'regular').optional(),
            facadeType: Joi.string().valid('economy', 'simple', 'luxury', 'custom').optional(),
            hasGarden: Joi.boolean().default(false),
            hasPool: Joi.boolean().default(false),
            hasHVAC: Joi.boolean().default(false),
            hasElevator: Joi.boolean().default(false),
            hasFence: Joi.boolean().default(false),
            brickDetails: Joi.object({
                width: Joi.number().positive().optional(),
                length: Joi.number().positive().optional(),
                height: Joi.number().positive().optional(),
                density: Joi.number().positive().optional()
            }).optional(),
            concreteVolume: Joi.number().positive().optional(),
            apartmentsCount: Joi.number().integer().min(0).optional(),
            customFacade: Joi.object({
                area: Joi.number().positive().optional(),
                price: Joi.number().positive().optional()
            }).optional(),
            internalWalls: Joi.object({
                area: Joi.number().positive().optional(),
                price: Joi.number().positive().optional()
            }).optional(),
            basement: Joi.object({
                floors: Joi.number().integer().min(0).optional(),
                ceilingArea: Joi.number().positive().optional(),
                price: Joi.number().positive().optional()
            }).optional()
        }).required(),
        prices: Joi.object({
            flooring: Joi.number().positive().optional(),
            wallInstallation: Joi.number().positive().optional(),
            wallPainting: Joi.number().positive().optional(),
            windowsDoors: Joi.number().positive().optional(),
            stairsRailing: Joi.number().positive().default(0)
        }).optional(),
        stairsRailingLength: Joi.number().min(0).default(0),
        hasMap: Joi.boolean().default(false),
        technicalDetails: Joi.when('hasMap', {
            is: true,
            then: Joi.object({
                totalRoofArea: Joi.number().positive().optional(),
                externalAreas: Joi.number().positive().optional(),
                skylightsArea: Joi.number().positive().optional(),
                tiesLength: Joi.number().positive().optional(),
                invertedBeams: Joi.number().positive().optional(),
                externalWalls24cm: Joi.number().positive().optional(),
                internalWalls24cm: Joi.number().positive().optional(),
                roofFenceLength: Joi.number().positive().optional(),
                externalDoors: Joi.number().integer().min(0).optional(),
                internalDoors: Joi.number().integer().min(0).optional(),
                facadeWindowsDoorsArea: Joi.number().positive().optional(),
                skylightWindowsDoorsArea: Joi.number().positive().optional(),
                secondaryCeilingsArea: Joi.number().positive().optional(),
                decorativeWallsArea: Joi.number().positive().optional(),
                claddingWallsArea: Joi.number().positive().optional()
            }).optional(),
            otherwise: Joi.forbidden()
        })
    }).options({ abortEarly: false });

    const { error } = schema.validate(data);
    if (error) {
        const errors = error.details.map(err => err.message);
        throw new Error(`خطأ في التحقق من البيانات: ${errors.join(' | ')}`);
    }
};

module.exports = (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('البيانات المستلمة فارغة:', {
                ip: req.ip,
                timestamp: new Date().toISOString()
            });
            return res.status(400).json({
                success: false,
                error: 'البيانات المرسلة فارغة أو غير صالحة',
                timestamp: new Date().toISOString()
            });
        }

        console.log('البيانات المستلمة في middleware:', JSON.stringify(req.body, null, 2));
        validateRequestData(req.body);
        req.handler = req.body.hasMap ? advancedCalculate : calculate;

        if (!req.handler) {
            console.error('خطأ: لم يتم تعيين المعالج', {
                ip: req.ip,
                body: req.body,
                timestamp: new Date().toISOString()
            });
            return res.status(500).json({
                success: false,
                error: 'لم يتم تعيين معالج الطلب',
                timestamp: new Date().toISOString()
            });
        }

        next();
    } catch (error) {
        console.error('فشل التحقق:', {
            ip: req.ip,
            error: error.message,
            body: req.body,
            timestamp: new Date().toISOString()
        });
        res.status(400).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
