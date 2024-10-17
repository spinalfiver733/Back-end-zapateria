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
    const { marca, modelo, numero, color, precio ,codigo_barra} = req.body;
    
    if (!marca || !modelo || !numero || !color || !precio || !codigo_barra) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoProducto = await InventarioInfo.create({
      MARCA: marca,
      MODELO: modelo,
      TALLA: numero,
      COLOR: color,
      PRECIO: parseFloat(precio),
      CODIGO_BARRA: codigo_barra,
      FECHA_INGRESO: new Date(),
      FK_ESTATUS_PRODUCTO: 1
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto al inventario' });
  }
});

// Añade esta nueva ruta al final de tu archivo inventario.js

// Ruta para actualizar el estado de un producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { FK_ESTATUS_PRODUCTO } = req.body;

    const producto = await InventarioInfo.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await producto.update({ FK_ESTATUS_PRODUCTO });
    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

// Nueva ruta para obtener un producto específico por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await InventarioInfo.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
});

module.exports = router;