const express = require('express');
const router = express.Router();
const MetodosPago = require('../models/MetodosPago');

// Obtener todos los métodos de pago
router.get('/', async (req, res) => {
  try {
    const metodosPago = await MetodosPago.findAll();
    console.log('Métodos de pago enviados:', metodosPago);
    res.json(metodosPago);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;