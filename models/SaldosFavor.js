const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const DevolucionesInfo = require('./DevolucionesInfo');
const VentasInfo = require('./VentasInfo');

class SaldosFavor extends Model {}

SaldosFavor.init({
    PK_SALDO: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    FK_DEVOLUCION: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DevolucionesInfo,
            key: 'PK_DEVOLUCION'
        }
    },
    CODIGO_UNICO: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    MONTO: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    ESTADO: {
        type: DataTypes.ENUM('activo', 'usado', 'cancelado'),
        defaultValue: 'activo'
    },
    FECHA_CREACION: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    FK_VENTA_USO: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: VentasInfo,
            key: 'PK_VENTA'
        }
    }
}, {
    sequelize,
    modelName: 'SaldosFavor',
    tableName: 'saldos_favor',
    timestamps: false
});

module.exports = SaldosFavor;