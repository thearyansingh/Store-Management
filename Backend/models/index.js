// src/models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: { underscored: true }
  }
);

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(60), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  address: { type: DataTypes.STRING(400) },
  role: { type: DataTypes.ENUM('admin', 'user', 'owner'), defaultValue: 'user' },
}, { tableName: 'users' });

const Store = sequelize.define('Store', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(100) },
  address: { type: DataTypes.STRING(400) },
}, { tableName: 'stores' });

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
}, {
  tableName: 'ratings',
  indexes: [{ unique: true, fields: ['user_id', 'store_id'] }]
});

// Associations
User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.belongsToMany(Store, { through: Rating, foreignKey: 'user_id', otherKey: 'store_id', as: 'ratedStores' });
Store.belongsToMany(User, { through: Rating, foreignKey: 'store_id', otherKey: 'user_id', as: 'raters' });

Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

export { sequelize, User, Store, Rating };
