const express = require('express');
const router = express.Router();
const InventarioInfo = require('../models/InventarioInfo');

// Obtener todos los productos del inventario
router.get('/', async (req, res) => {
  try {
    const inventario = await InventarioInfo.findAll();
    console.log('Inventario enviado:', inventario);
    res.json(inventario);
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ message: error.message });
  }
});

// Agregar un nuevo producto al inventario
router.post('/', async (req, res) => {
  try {
    const { talla, modelo, color, precio, vendedor } = req.body;
    
    // Validación básica
    if (!talla || !modelo || !color || !precio) {
      return res.status(400).json({ message: 'Talla, modelo, color y precio son campos requeridos' });
    }

    const nuevoProducto = await InventarioInfo.create({
      TALLA: talla,
      MODELO: modelo,
      COLOR: color,
      PRECIO: parseFloat(precio),
      VENDEDOR: vendedor || null,
      METODO_PAGO: null,
      FECHA_VENTA: null
    });

    console.log('Nuevo producto agregado:', nuevoProducto);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto al inventario' });
  }
});

module.exports = router;