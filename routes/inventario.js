const express = require('express');
const router = express.Router();
const InventarioInfo = require('../models/InventarioInfo');

router.get('/', async (req, res) => {
  try {
    const inventario = await InventarioInfo.findAll();
    console.log('Inventario enviado:', inventario); // Para depuración
    res.json(inventario);
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;