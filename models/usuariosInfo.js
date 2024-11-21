const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PdvUsuarios = sequelize.define('PdvUsuarios', {
  ID_USUARIO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FK_ROL_USUARIO: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  NOMBRE_USUARIO: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  PATERNO_USUARIO: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  MATERNO_USUARIO: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  NUMERO_USUARIO: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  ESTATUS_USUARIO: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'pdv_usuarios',
  timestamps: false
});

module.exports = PdvUsuarios;