// models/associations.js
const Orden = require('./Ordenes');
const VentasInfo = require('./VentasInfo');
const InventarioInfo = require('./InventarioInfo');

// Definir relaciones
Orden.hasMany(VentasInfo, { foreignKey: 'FK_ORDEN' });
VentasInfo.belongsTo(Orden, { foreignKey: 'FK_ORDEN' });

VentasInfo.belongsTo(InventarioInfo, { foreignKey: 'FK_PRODUCTO' });
InventarioInfo.hasMany(VentasInfo, { foreignKey: 'FK_PRODUCTO' });

module.exports = { Orden, VentasInfo, InventarioInfo };