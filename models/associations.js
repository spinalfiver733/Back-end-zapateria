const Orden = require('./Ordenes');
const VentasInfo = require('./VentasInfo');
const InventarioInfo = require('./InventarioInfo');
const PdvUsuarios = require('./usuariosInfo');

// Definir relaciones
Orden.hasMany(VentasInfo, { foreignKey: 'FK_ORDEN' });
VentasInfo.belongsTo(Orden, { foreignKey: 'FK_ORDEN' });

VentasInfo.belongsTo(InventarioInfo, { foreignKey: 'FK_PRODUCTO' });
InventarioInfo.hasMany(VentasInfo, { foreignKey: 'FK_PRODUCTO' });

// Nueva relación
VentasInfo.belongsTo(PdvUsuarios, { foreignKey: 'VENDEDOR', as: 'Vendedor' });
PdvUsuarios.hasMany(VentasInfo, { foreignKey: 'VENDEDOR' });

module.exports = { Orden, VentasInfo, InventarioInfo, PdvUsuarios };