module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const formData = req.body;
    console.log('تم استلام البيانات:', formData); // للتأكد من استلام البيانات
    
    // إرجاع نفس البيانات مع إضافة رسالة نجاح
    res.json({
      success: true,
      message: "تم استلام البيانات بنجاح",
      originalData: formData
    });
  } else {
    res.status(405).json({ error: 'الطريقة غير مسموحة' });
  }
};
