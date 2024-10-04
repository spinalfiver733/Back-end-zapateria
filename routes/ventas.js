const express = require('express');
const router = express.Router();
const VentasInfo = require('../models/VentasInfo');
const InventarioInfo = require('../models/InventarioInfo');
const sequelize = require('../config/database');

// Realizar una nueva venta
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      const { FK_PRODUCTO, VENDEDOR, METODO_PAGO, OBSERVACIONES, PRECIO } = req.body;
  
      // Verificar si el producto existe y está disponible
      const producto = await InventarioInfo.findOne({
        where: { 
          PK_PRODUCTO: FK_PRODUCTO,
          FK_ESTATUS_PRODUCTO: 1 
        }
      }, { transaction: t });
  
      if (!producto) {
        await t.rollback();
        return res.status(404).json({ message: 'Producto no encontrado o no disponible' });
      }
  
      // Crear la venta
      const nuevaVenta = await VentasInfo.create({
        FK_PRODUCTO,
        TALLA: producto.TALLA,
        MODELO: producto.MODELO,
        MARCA: producto.MARCA,
        COLOR: producto.COLOR,
        PRECIO: PRECIO || producto.PRECIO,
        VENDEDOR,
        METODO_PAGO,
        FECHA_VENTA: new Date(),
        OBSERVACIONES
      }, { transaction: t });
  
      // Actualizar el estado del producto en el inventario
      await InventarioInfo.update(
        { FK_ESTATUS_PRODUCTO: 2 },  // Asumiendo que 2 significa "vendido"
        { where: { PK_PRODUCTO: FK_PRODUCTO }, transaction: t }
      );
  
      await t.commit();
      res.status(201).json(nuevaVenta);
  
    } catch (error) {
      await t.rollback();
      console.error('Error al realizar la venta:', error);
      res.status(500).json({ message: 'Error al procesar la venta', error: error.message });
    }
  });

module.exports = router;