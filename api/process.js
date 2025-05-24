// process.js
function routeCalculation(inputs) {
    try {
        if (!inputs) {
            throw new Error('البيانات المرسلة فارغة');
        }
        const hasMap = inputs.hasMap || false;
        if (hasMap && inputs.technicalDetails) {
            const technicalDetails = inputs.technicalDetails;
            const hasTechnicalData = technicalDetails && Object.values(technicalDetails).some(value => value !== 0 && value !== '' && value != null);
            if (hasTechnicalData) {
                console.log('توجيه إلى advancedCalculate');
                return { module: 'advancedCalculate', data: inputs };
            }
        }
        console.log('توجيه إلى calculate');
        return { module: 'calculate', data: inputs };
    } catch (error) {
        console.error('خطأ في routeCalculation:', error);
        throw new Error(`فشل في توجيه البيانات: ${error.message}`);
    }
}
export default routeCalculation;
