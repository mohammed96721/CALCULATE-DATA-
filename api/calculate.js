module.exports = async (req, res) => {
  try {
    const body = req.body || (req.body && JSON.parse(req.body));
    
    const prices = {
      economy: 500000,
      standard: 750000,
      luxury: 1000000,
      elevator: 15000000,
      room: 2000000,
      bathroom: 1500000,
      floor: 5000000
    };

    const { area, floors, rooms, bathrooms, finish, elevator } = body;
    
    const total = area * prices[finish] + 
                 rooms * prices.room + 
                 bathrooms * prices.bathroom + 
                 (floors - 1) * prices.floor + 
                 (elevator === 'yes' ? prices.elevator : 0);

    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في الحساب' });
  }
};