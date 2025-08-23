
import { Store,Rating,User,sequelize } from '../models/index.js';
import Op from 'sequelize';

export const getOwnerStores = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      attributes: ['id','name','email','address',
        [sequelize.literal(`(SELECT ROUND(AVG(r.rating),2) FROM ratings r WHERE r.store_id = Store.id)`), 'average_rating']
      ]
    });
    return res.json(stores);
  } catch (err) {
    next(err);
  }
};

export const getStoreRatings = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const storeId = +req.params.storeId;

    const store = await Store.findOne({ where: { id: storeId, owner_id: ownerId }});
    if (!store) return res.status(404).json({ message: 'Store not found or not owned by you' });

    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: User, as: 'user', attributes: ['id','name','email','address'] }],
      attributes: ['id','rating','created_at','updated_at']
    });

    // compute average
    const avg = await Rating.findAll({
      where: { store_id: storeId },
      attributes: [[sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('rating')), 2), 'avg_rating']],
      raw: true
    });

    return res.json({ average: avg[0].avg_rating || 0, raters: ratings });
  } catch (err) {
    next(err);
  }
};
