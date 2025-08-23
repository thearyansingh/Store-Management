
import { Store,Rating,sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const listPublicStores = async (req, res, next) => {
  try {
    const { name, address, page = 1, limit = 20, userId } = req.query; 
    // userId optional - if provided, include user's submitted rating

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const offset = (page - 1) * limit;

    // raw query for avg and my_rating
    const replacements = [];
    let myRatingSelect = 'NULL as my_rating';
    if (userId) {
      replacements.push(userId);
      myRatingSelect = `(SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as my_rating`;
    }

    const sql = `
      SELECT s.id, s.name, s.address, s.email,
             COALESCE(ROUND(AVG(r.rating),2),0) AS overall_rating,
             ${myRatingSelect}
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      ${userId ? '' : ''}
      GROUP BY s.id
      LIMIT ? OFFSET ?;
    `;

    if (userId) replacements.push(+limit, +offset);
    else replacements.push(+limit, +offset);

    const stores = await sequelize.query(sql, { replacements, type: sequelize.QueryTypes.SELECT });

    return res.json({ page: +page, perPage: +limit, data: stores });
  } catch (err) {
    next(err);
  }
};

export const getStoreDetails = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId || null;
    const sql = `
      SELECT s.id, s.name, s.address, s.email,
             COALESCE(ROUND(AVG(r.rating),2),0) AS overall_rating,
             ${userId ? '(SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as my_rating' : 'NULL as my_rating'}
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.id = ?
      GROUP BY s.id
      LIMIT 1;
    `;
    const replacements = userId ? [userId, id] : [id];
    const rows = await sequelize.query(sql, { replacements, type: sequelize.QueryTypes.SELECT });
    if (!rows.length) return res.status(404).json({ message: 'Store not found' });
    return res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
