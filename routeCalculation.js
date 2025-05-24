// routeCalculation.js
function routeCalculation(inputs) {
    const startTime = performance.now();
    try {
        if (!inputs) {
            throw new Error('البيانات المرسلة فارغة');
        }
        console.log('حجم inputs:', JSON.stringify(inputs).length, 'بايت');
        const hasMap = inputs.hasMap || false;
        if (hasMap && inputs.technicalDetails) {
            const technicalDetails = inputs.technicalDetails;
            console.log('حجم technicalDetails:', JSON.stringify(technicalDetails).length, 'بايت');
            const hasTechnicalData = technicalDetails && Object.values(technicalDetails).some(value => value !== 0 && value !== '' && value != null);
            if (hasTechnicalData) {
                console.log('توجيه إلى advancedCalculate');
                const endTime = performance.now();
                console.log(`routeCalculation استغرق ${endTime - startTime} ميلي ثانية`);
                return { module: 'advancedCalculate', data: inputs };
            }
        }
        console.log('توجيه إلى calculate');
        const endTime = performance.now();
        console.log(`routeCalculation استغرق ${endTime - startTime} ميلي ثانية`);
        return { module: 'calculate', data: inputs };
    } catch (error) {
        console.error('خطأ في routeCalculation:', error);
        const endTime = performance.now();
        console.log(`routeCalculation فشل بعد ${endTime - startTime} ميلي ثانية`);
        throw new Error(`فشل في توجيه البيانات: ${error.message}`);
    }
}

export default routeCalculation;
