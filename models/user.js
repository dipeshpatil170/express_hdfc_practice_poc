const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Order = require('./order');
const Token = require('./token');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

User.hasMany(Token, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = User;
