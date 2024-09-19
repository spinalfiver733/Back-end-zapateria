const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventarioInfo = sequelize.define('InventarioInfo', {
  PK_PRODUCTO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TALLA: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  MODELO: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  VENDEDOR: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  COLOR: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  PRECIO: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  METODO_PAGO: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  FECHA_VENTA: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'inventario_info',
  timestamps: false
});

module.exports = InventarioInfo;