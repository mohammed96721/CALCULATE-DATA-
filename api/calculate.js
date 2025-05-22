module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const formData = req.body;
    console.log('تم استلام البيانات:', formData); // فقط للتأكد من استلام البيانات
    
    // إرجاع نفس البيانات المستلمة بدون تغيير
    res.json({
      success: true,
      originalData: formData
    });
  } else {
    res.status(405).json({ error: 'الطريقة غير مسموحة' });
  }
};
