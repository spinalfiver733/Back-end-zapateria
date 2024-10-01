const express = require('express');
const router = express.Router();
const InventarioInfo = require('../models/InventarioInfo');

// Obtener todas las marcas únicas
router.get('/marcas', async (req, res) => {
  try {
    const marcas = await InventarioInfo.findAll({
      attributes: ['MARCA'],
      group: ['MARCA'],
      raw: true
    });
    res.json(marcas.map(item => item.MARCA));
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ message: error.message });
  }
});

// Obtener modelos por marca
router.get('/modelos/:marca', async (req, res) => {
  try {
    const modelos = await InventarioInfo.findAll({
      attributes: ['MODELO'],
      where: { MARCA: req.params.marca },
      group: ['MODELO'],
      raw: true
    });
    res.json(modelos.map(item => item.MODELO));
  } catch (error) {
    console.error('Error al obtener modelos:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ruta existente para obtener todos los productos del inventario
router.get('/', async (req, res) => {
  try {
    const inventario = await InventarioInfo.findAll({
      where: {
        FK_ESTATUS_PRODUCTO: 1
      }
    });
    res.json(inventario);
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ruta existente para agregar un nuevo producto al inventario
router.post('/', async (req, res) => {
  try {
    const { marca, modelo, numero, color, precio } = req.body;
    
    if (!marca || !modelo || !numero || !color || !precio) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoProducto = await InventarioInfo.create({
      MARCA: marca,
      MODELO: modelo,
      TALLA: numero,
      COLOR: color,
      PRECIO: parseFloat(precio),
      FECHA_INGRESO: new Date(),
      FK_ESTATUS_PRODUCTO: 1
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto al inventario' });
  }
});

module.exports = router;