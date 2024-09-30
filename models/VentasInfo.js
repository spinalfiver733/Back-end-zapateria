const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const InventarioInfo = require('./InventarioInfo');

const VentasInfo = sequelize.define('VentasInfo', {
    PK_VENTA: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    VENDEDOR: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    METODO_PAGO: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    FECHA_VENTA: {
        type: DataTypes.DATE,
        allowNull: false
    },
    OBSERVACIONES: {
        type: DataTypes.STRING(200),
        allowNull: true
    },   
    FK_PRODUCTO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: InventarioInfo,
            key: 'PK_PRODUCTO'
        }
    }
});

VentasInfo.belongsTo(InventarioInfo, { foreignKey: 'FK_PRODUCTO' });

module.exports = VentasInfo;