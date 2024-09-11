const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventarioInfo = sequelize.define('InventarioInfo', {
  PK_PRODUCTO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TALLA: DataTypes.STRING(10),
  MODELO: DataTypes.STRING(50),
  VENDEDOR: DataTypes.STRING(50),
  COLOR: DataTypes.STRING(20),
  PRECIO: DataTypes.DECIMAL(10, 2),
  METODO_PAGO: DataTypes.STRING(20),
  FECHA_VENTA: DataTypes.DATE
}, {
  tableName: 'inventario_info',
  timestamps: false // Si tu tabla no tiene createdAt y updatedAt
});

module.exports = InventarioInfo; 