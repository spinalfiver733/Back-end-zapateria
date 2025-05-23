const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const InventarioInfo = require('./InventarioInfo');

class VentasInfo extends Model {}

VentasInfo.init({
    PK_VENTA: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MARCA: {
        type: DataTypes.STRING(100),
        allowNull: true
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,  
        allowNull: true,
        references: {
            model: 'metodos_pago',
            key: 'PK_METODO'
        }
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
    },
    FK_ORDEN: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    FK_ESTATUS_VENTA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
}, {
    sequelize,
    modelName: 'VentasInfo',
    tableName: 'ventas_info',
    timestamps: false
});

module.exports = VentasInfo;