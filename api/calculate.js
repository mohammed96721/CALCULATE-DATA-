module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const formData = req.body;
      console.log('تم استلام البيانات:', JSON.stringify(formData, null, 2));
      
      // إرجاع نفس البيانات المستلمة مع إضافة نجاح
      res.json({
        success: true,
        message: "تم استلام البيانات بنجاح",
        originalData: formData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('خطأ في معالجة الطلب:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ في الخادم'
      });
    }
  } else {
    res.status(405).json({ 
      success: false,
      error: 'الطريقة غير مسموحة. يسمح فقط بطلبات POST' 
    });
  }
};
