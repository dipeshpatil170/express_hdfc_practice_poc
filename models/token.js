const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accessTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  refreshTokenExpiry: {
    type: DataTypes.DATE,
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


module.exports = Token;
