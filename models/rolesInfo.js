const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PdvRoles = sequelize.define('PdvRoles', {
  ID_ROL: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DESCRIPCION_ROL: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'pdv_roles',
  timestamps: false 
});

module.exports = PdvRoles;
