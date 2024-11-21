const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstatusVenta = sequelize.define('EstatusVenta', {
  PK_ESTATUS: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DESCRIPCION: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'estatus_venta',
  timestamps: false
});

module.exports = EstatusVenta;