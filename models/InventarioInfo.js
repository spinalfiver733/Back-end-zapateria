const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventarioInfo = sequelize.define('InventarioInfo', {
  PK_PRODUCTO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MARCA: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  MODELO: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  TALLA: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  COLOR: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  PRECIO: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  FECHA_INGRESO: {
    type: DataTypes.DATE,
    allowNull: false
  },
  FK_ESTATUS_PRODUCTO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
},{
  tableName: 'inventario_info',
  timestamps: false
});

module.exports = InventarioInfo;