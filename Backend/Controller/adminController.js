
import { User, Store, Rating, sequelize } from '../models/index.js';
import bcrypt from 'bcryptjs';
import { passwordRegex, emailRegex } from '../utils/validators.js';
import { Op, QueryTypes } from 'sequelize';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || name.length<10 || name.length > 60)
      return res.status(400).json({ message: 'Name must be 20-60 characters.' });

    if (!email || !emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email' });

    if (!password || !passwordRegex.test(password))
      return res.status(400).json({
        message: 'Password must be 8-16 chars, include uppercase and special char.'
      });

    if (!address)
      return res.status(400).json({ message: 'Address too long' });

    if (!['admin', 'user', 'owner'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role });

    return res
      .status(201)
      .json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, page = 1, limit = 20 } = req.query;
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role'],
      limit: +limit,
      offset: +offset
    });

    return res.json({
      total: users.count,
      page: +page,
      perPage: +limit,
      data: users.rows
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'address', 'role']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = user.toJSON();

    if (user.role === 'owner') {
      const [avgRes] = await sequelize.query(
        `
        SELECT ROUND(AVG(r.rating), 2) as avg_rating
        FROM ratings r
        JOIN stores s ON s.id = r.store_id
        WHERE s.owner_id = ?
        `,
        {
          replacements: [user.id],
          type: QueryTypes.SELECT
        }
      );
      result.average_rating = avgRes?.avg_rating ?? 0;
    }

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

  export const createStore = async (req, res, next) => {
    try {
      const { name, email, address, owner_id } = req.body;

      if (!name) return res.status(400).json({ message: 'Name required' });
      if (!address)
        return res.status(400).json({ message: 'Address required' });
      if (email && !emailRegex.test(email))
        return res.status(400).json({ message: 'Invalid email' });

      if (owner_id) {
        const owner = await User.findByPk(owner_id);
        if (!owner) return res.status(404).json({ message: 'Owner not found' });
        if (owner.role !== 'owner')
          return res.status(400).json({ message: 'User is not a store owner' });
      }

      const store = await Store.create({
        name,
        email,
        address,
        owner_id: owner_id || null
      });

      return res.status(201).json(store);
    } catch (err) {
      next(err);
    }
  };

  export const listStores = async (req, res, next) => {
    try {
      const { name, email, address, page = 1, limit = 20 } = req.query;
      const where = {};

      if (name) where.name = { [Op.like]: `%${name}%` };
      if (email) where.email = { [Op.like]: `%${email}%` };
      if (address) where.address = { [Op.like]: `%${address}%` };

      const offset = (page - 1) * limit;

      const stores = await Store.findAll({
        where,
        attributes: [
          'id',
          'name',
          'email',
          'address',
          'owner_id',
          [
            sequelize.literal(
              `(SELECT ROUND(AVG(r.rating), 2) FROM ratings r WHERE r.store_id = Store.id)`
            ),
            'average_rating'
          ]
        ],
        limit: +limit,
        offset: +offset
      });

      const total = await Store.count({ where });

      return res.json({
        total,
        page: +page,
        perPage: +limit,
        data: stores
      });
    } catch (err) {
      next(err);
    }
  };

export const adminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
};
