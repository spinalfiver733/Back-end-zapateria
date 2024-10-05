const express = require('express');
const router = express.Router();
const { Orden, VentasInfo, InventarioInfo } = require('../models/associations');
const sequelize = require('../config/database');

// Validación de entrada
const validateOrderInput = (body) => {
  const { VENDEDOR, METODO_PAGO, productos } = body;
  if (!VENDEDOR || !METODO_PAGO || !productos || !Array.isArray(productos) || productos.length === 0) {
    throw new Error('Datos de entrada inválidos');
  }
};

// Crear una nueva orden con múltiples productos
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    validateOrderInput(req.body);
    const { VENDEDOR, METODO_PAGO, OBSERVACIONES, productos } = req.body;

    // Crear la orden
    const nuevaOrden = await Orden.create({
      FECHA_ORDEN: new Date(),
      VENDEDOR,
      METODO_PAGO,
      OBSERVACIONES,
      TOTAL: 0 // Se actualizará después
    }, { transaction: t });

    let total = 0;
    const ventasInfoData = [];

    // Procesar cada producto en la orden
    for (const producto of productos) {
      const { FK_PRODUCTO, PRECIO, MARCA, OBSERVACIONES: productoObservaciones } = producto;

      // Verificar si el producto existe y está en estado "En venta" (3)
      const inventarioProducto = await InventarioInfo.findOne({
        where: { 
          PK_PRODUCTO: FK_PRODUCTO,
          FK_ESTATUS_PRODUCTO: 3
        }
      }, { transaction: t });

      if (!inventarioProducto) {
        await t.rollback();
        return res.status(404).json({ message: `Producto ${FK_PRODUCTO} no encontrado o no está en estado de venta` });
      }

      // Preparar datos para VentasInfo
      ventasInfoData.push({
        FK_ORDEN: nuevaOrden.PK_ORDEN,
        FK_PRODUCTO,
        TALLA: inventarioProducto.TALLA,
        MODELO: inventarioProducto.MODELO,
        COLOR: inventarioProducto.COLOR,
        PRECIO: PRECIO || inventarioProducto.PRECIO,
        VENDEDOR,
        METODO_PAGO,
        FECHA_VENTA: new Date(),
        OBSERVACIONES: productoObservaciones || OBSERVACIONES || '',
        MARCA: MARCA || inventarioProducto.MARCA // Aseguramos que MARCA se incluya
      });

      // Actualizar el estado del producto en el inventario a "Vendido" (2)
      await InventarioInfo.update(
        { FK_ESTATUS_PRODUCTO: 2 },
        { where: { PK_PRODUCTO: FK_PRODUCTO }, transaction: t }
      );

      total += parseFloat(PRECIO || inventarioProducto.PRECIO);
    }

    // Crear todas las VentasInfo de una vez
    await VentasInfo.bulkCreate(ventasInfoData, { transaction: t });

    // Actualizar el total de la orden
    await nuevaOrden.update({ TOTAL: total }, { transaction: t });

    await t.commit();
    res.status(201).json(nuevaOrden);

  } catch (error) {
    await t.rollback();
    console.error('Error al crear la orden:', error);
    res.status(500).json({ message: 'Error al procesar la orden', error: error.message });
  }
});

// Obtener todas las órdenes
router.get('/', async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [{ model: VentasInfo, include: [InventarioInfo] }]
    });
    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
  }
});

// Obtener una orden específica por ID
router.get('/:id', async (req, res) => {
  try {
    const orden = await Orden.findByPk(req.params.id, {
      include: [{ model: VentasInfo, include: [InventarioInfo] }]
    });
    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json(orden);
  } catch (error) {
    console.error('Error al obtener la orden:', error);
    res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
  }
});

// Actualizar una orden
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const orden = await Orden.findByPk(req.params.id, { transaction: t });
    if (!orden) {
      await t.rollback();
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    await orden.update(req.body, { transaction: t });
    await t.commit();
    res.json(orden);
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar la orden:', error);
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
  }
});

// Eliminar una orden
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const orden = await Orden.findByPk(req.params.id, { transaction: t });
    if (!orden) {
      await t.rollback();
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    await orden.destroy({ transaction: t });
    await t.commit();
    res.json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar la orden:', error);
    res.status(500).json({ message: 'Error al eliminar la orden', error: error.message });
  }
});

module.exports = router;