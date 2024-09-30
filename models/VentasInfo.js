const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const InventarioInfo = require('./InventarioInfo');

const VentasInfo = sequelize.define('VentasInfo', {
    PK_VENTA: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TALLA: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    MODELO: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    VENDEDOR: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    COLOR: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    PRECIO: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    METODO_PAGO: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    FECHA_VENTA: {
        type: DataTypes.DATE,
        allowNull: true
    },
    OBSERVACIONES: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    FK_PRODUCTO: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: InventarioInfo,
            key: 'PK_PRODUCTO'
        }
    }
}, {
    tableName: 'ventas_info',
    timestamps: false
});

VentasInfo.belongsTo(InventarioInfo, { foreignKey: 'FK_PRODUCTO' });

module.exports = VentasInfo;