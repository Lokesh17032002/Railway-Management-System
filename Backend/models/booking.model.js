const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Booking = db.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  trainId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatsBooked: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Booking;
