const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const InventarioInfo = require('./InventarioInfo');
const VentasInfo = require('./VentasInfo');
const PdvUsuarios = require('./usuariosInfo');

class DevolucionesInfo extends Model {}

DevolucionesInfo.init({
    PK_DEVOLUCION: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    FK_PRODUCTO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: InventarioInfo,
            key: 'PK_PRODUCTO'
        }
    },
    FK_VENTA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: VentasInfo,
            key: 'PK_VENTA'
        }
    },
    FK_VENDEDOR: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PdvUsuarios,
            key: 'ID_USUARIO'
        }
    },
    FECHA_DEVOLUCION: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    MOTIVO: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    DESCRIPCION_MOTIVO: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ESTADO_FINAL: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    OBSERVACIONES: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    TIPO_DEVOLUCION: {
        type: DataTypes.ENUM('cambio', 'saldo_favor'),
        allowNull: false
    },
    FK_VENTA_NUEVA: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: VentasInfo,
            key: 'PK_VENTA'
        }
    },
    DIFERENCIA_PRECIO: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'DevolucionesInfo',
    tableName: 'devoluciones_info',
    timestamps: false
});

module.exports = DevolucionesInfo;