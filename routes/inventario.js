const express = require('express');
const router = express.Router();
const InventarioInfo = require('../models/InventarioInfo');

// Obtener todos los productos del inventario
router.get('/', async (req, res) => {
  try {
    const inventario = await InventarioInfo.findAll({
      where: {
        FK_ESTATUS_PRODUCTO: 1  // Filtra solo los productos con status 1 (en inventario)
      }
    });
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
    const { modelo, numero, color, precio } = req.body;
    
    // Validación básica
    if (!modelo || !numero || !color || !precio) {
      return res.status(400).json({ message: 'Modelo, número, color y precio son campos requeridos' });
    }

    const nuevoProducto = await InventarioInfo.create({
      MODELO: modelo,
      TALLA: numero,
      COLOR: color,
      PRECIO: parseFloat(precio),
      VENDEDOR: null,
      METODO_PAGO: null,
      FECHA_INGRESO: new Date(),
      FK_ESTATUS_PRODUCTO: 1  // Asigna el status 1 (en inventario) al crear un nuevo producto
    });

    console.log('Nuevo producto agregado:', nuevoProducto);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto al inventario' });
  }
});

module.exports = router;