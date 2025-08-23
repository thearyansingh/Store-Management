
import { Rating,Store,sequelize } from '../models/index.js';

export const submitOrUpdateRating = async (req, res, next) => {
  const userId = req.user.id;
  const storeId = +req.params.storeId;
  const { rating } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be integer between 1 and 5' });
 
  const t = await sequelize.transaction();
  try {
    const store = await Store.findByPk(storeId);
    if (!store) {
      await t.rollback();
      return res.status(404).json({ message: 'Store not found' });
    }

    const [row, created] = await Rating.findOrCreate({
      where: { user_id: userId, store_id: storeId },
      defaults: { rating, user_id: userId, store_id: storeId },
      transaction: t
    });

    if (!created) {
      row.rating = rating;
      await row.save({ transaction: t });
    }

    await t.commit();
    return res.json({ message: created ? 'Rating submitted' : 'Rating updated' });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const deleteRating = async (req, res, next) => {
  const userId = req.user.id;
  const storeId = +req.params.storeId;
  try {
    const destroyed = await Rating.destroy({ where: { user_id: userId, store_id: storeId } });
    if (!destroyed) return res.status(404).json({ message: 'Rating not found' });
    return res.json({ message: 'Rating deleted' });
  } catch (err) {
    next(err);
  }
};
