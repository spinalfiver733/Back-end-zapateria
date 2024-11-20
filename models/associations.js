const Orden = require('./Ordenes');
const VentasInfo = require('./VentasInfo');
const InventarioInfo = require('./InventarioInfo');
const PdvUsuarios = require('./usuariosInfo');
const DevolucionesInfo = require('./DevolucionesInfo');
const SaldosFavor = require('./SaldosFavor');
const MetodosPago = require('./MetodosPago');


// Asociaciones de Ordenes y Ventas
Orden.hasMany(VentasInfo, { foreignKey: 'FK_ORDEN' });
VentasInfo.belongsTo(Orden, { foreignKey: 'FK_ORDEN' });

// Asociaciones de Ventas e Inventario
VentasInfo.belongsTo(InventarioInfo, { foreignKey: 'FK_PRODUCTO' });
InventarioInfo.hasMany(VentasInfo, { foreignKey: 'FK_PRODUCTO' });

// Asociaciones de Ventas y Usuarios
VentasInfo.belongsTo(PdvUsuarios, { foreignKey: 'VENDEDOR', as: 'Vendedor' });
PdvUsuarios.hasMany(VentasInfo, { foreignKey: 'VENDEDOR' });

// Asociaciones para Devoluciones
DevolucionesInfo.belongsTo(InventarioInfo, { foreignKey: 'FK_PRODUCTO', as: 'Producto' });
DevolucionesInfo.belongsTo(VentasInfo, { foreignKey: 'FK_VENTA', as: 'VentaOriginal' });
DevolucionesInfo.belongsTo(VentasInfo, { foreignKey: 'FK_VENTA_NUEVA', as: 'VentaNueva' });
DevolucionesInfo.belongsTo(PdvUsuarios, { foreignKey: 'FK_VENDEDOR', as: 'Vendedor' });

// Asociaciones inversas para Devoluciones
InventarioInfo.hasMany(DevolucionesInfo, { foreignKey: 'FK_PRODUCTO' });
VentasInfo.hasMany(DevolucionesInfo, { foreignKey: 'FK_VENTA' });
VentasInfo.hasMany(DevolucionesInfo, { foreignKey: 'FK_VENTA_NUEVA' });
PdvUsuarios.hasMany(DevolucionesInfo, { foreignKey: 'FK_VENDEDOR' });

// Asociaciones para Saldos
SaldosFavor.belongsTo(DevolucionesInfo, { foreignKey: 'FK_DEVOLUCION', as: 'Devolucion' });
SaldosFavor.belongsTo(VentasInfo, { foreignKey: 'FK_VENTA_USO', as: 'VentaUso' });

// Asociaciones inversas para Saldos
DevolucionesInfo.hasMany(SaldosFavor, { foreignKey: 'FK_DEVOLUCION' });
VentasInfo.hasMany(SaldosFavor, { foreignKey: 'FK_VENTA_USO' });

// Asociación entre VentasInfo y MetodosPago
VentasInfo.belongsTo(MetodosPago, { foreignKey: 'METODO_PAGO', targetKey: 'PK_METODO', as: 'MetodoPago' });
MetodosPago.hasMany(VentasInfo, { foreignKey: 'METODO_PAGO', sourceKey: 'PK_METODO' });

module.exports = {
    Orden,
    VentasInfo,
    InventarioInfo,
    PdvUsuarios,
    DevolucionesInfo,
    SaldosFavor
};