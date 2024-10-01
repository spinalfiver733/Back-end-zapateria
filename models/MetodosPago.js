const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MetodosPago = sequelize.define('MetodosPago', {
  PK_METODO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DESCRIPCION_METODO: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'metodos_pago',
  timestamps: false
});

module.exports = MetodosPago;