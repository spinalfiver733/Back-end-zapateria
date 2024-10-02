const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const VentasInfo = require('./VentasInfo');

class Orden extends Model {}

Orden.init({
    PK_ORDEN: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    FECHA_ORDEN: {
        type: DataTypes.DATE,
        allowNull: false
    },
    VENDEDOR: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    METODO_PAGO: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    OBSERVACIONES: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    TOTAL: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Orden',
    tableName: 'ordenes',
    timestamps: false
});


module.exports = Orden;