module.exports = function validateInput(req, res, next) {
    try {
        const data = req.body;

        // التحقق من الحقول الأساسية
        if (!data.customer || !data.customer.name || !data.customer.phone) {
            return res.status(400).json({
                success: false,
                error: 'معلومات الزبون (الاسم ورقم الهاتف) مطلوبة'
            });
        }
        if (!data.location || !data.location.governorate || !data.location.area) {
            return res.status(400).json({
                success: false,
                error: 'معلومات الموقع (المحافظة والمنطقة) مطلوبة'
            });
        }
        if (!data.land || data.land.area <= 0 || data.land.facadeWidth <= 0) {
            return res.status(400).json({
                success: false,
                error: 'مواصفات الأرض (المساحة وعرض الواجهة) يجب أن تكون أكبر من 0'
            });
        }
        if (!data.building || data.building.floors < 1 || data.building.rooms < 1 || data.building.bathrooms < 1) {
            return res.status(400).json({
                success: false,
                error: 'مواصفات البناء (الطوابق، الغرف، الحمامات) يجب أن تكون 1 أو أكثر'
            });
        }
        if (!data.prices || data.prices.flooring <= 0 || data.prices.wallInstallation <= 0 || 
            data.prices.wallPainting <= 0 || data.prices.windowsDoors <= 0) {
            return res.status(400).json({
                success: false,
                error: 'أسعار التشطيبات يجب أن تكون أكبر من 0'
            });
        }

        // التحقق من التفاصيل الفنية إذا كان hasMap: true
        if (data.hasMap && (!data.technicalDetails || data.technicalDetails.totalRoofArea <= 0)) {
            return res.status(400).json({
                success: false,
                error: 'مساحة السقوف الحقيقية يجب أن تكون أكبر من 0 عند وجود خريطة'
            });
        }

        next();
    } catch (error) {
        console.error('خطأ في التحقق:', error.message);
        res.status(500).json({
            success: false,
            error: `خطأ داخلي في التحقق: ${error.message}`
        });
    }
};
