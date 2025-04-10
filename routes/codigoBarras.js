// routes/codigoBarras.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const InventarioInfo = require('../models/InventarioInfo');

// Obtener el último código de barras
router.get('/ultimo-codigo', async (req, res) => {
  try {
    // Buscar el código de barras más alto en la base de datos
    const ultimoProducto = await InventarioInfo.findOne({
      attributes: ['CODIGO_BARRA'],
      order: [['CODIGO_BARRA', 'DESC']],
      where: {
        CODIGO_BARRA: {
          [Op.regexp]: '^[0-9]{6}$' // Aseguramos que tenga formato de 6 dígitos
        }
      }
    });

    let ultimoCodigo = 0;
    if (ultimoProducto && ultimoProducto.CODIGO_BARRA) {
      // Convertir el código de string a número
      ultimoCodigo = parseInt(ultimoProducto.CODIGO_BARRA);
    }

    res.json({
      success: true,
      ultimoCodigo: String(ultimoCodigo).padStart(6, '0')
    });
  } catch (error) {
    console.error('Error al obtener el último código de barras:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la base de datos'
    });
  }
});

// Encontrar códigos disponibles (incluyendo huecos en la secuencia)
router.get('/codigos-disponibles/:cantidad', async (req, res) => {
  try {
    const cantidadSolicitada = parseInt(req.params.cantidad);
    
    if (isNaN(cantidadSolicitada) || cantidadSolicitada < 1) {
      return res.status(400).json({
        success: false,
        error: 'Cantidad inválida de códigos solicitados'
      });
    }
    
    // Obtener todos los códigos existentes ordenados
    const productos = await InventarioInfo.findAll({
      attributes: ['CODIGO_BARRA'],
      where: {
        CODIGO_BARRA: {
          [Op.regexp]: '^[0-9]{6}$' // Aseguramos que tenga formato de 6 dígitos
        }
      },
      order: [['CODIGO_BARRA', 'ASC']]
    });
    
    // Convertir los códigos a números para trabajar más fácilmente
    const codigosExistentes = productos.map(p => parseInt(p.CODIGO_BARRA));
    
    // Encontrar huecos en la secuencia
    const codigosDisponibles = [];
    let ultimoCodigo = 0;
    
    // Si no hay códigos existentes, empezamos desde 1
    if (codigosExistentes.length === 0) {
      for (let i = 1; i <= cantidadSolicitada; i++) {
        codigosDisponibles.push(i);
      }
    } else {
      // Buscar huecos en la secuencia existente
      ultimoCodigo = codigosExistentes[codigosExistentes.length - 1];
      
      // Primero buscamos huecos
      let huecos = [];
      for (let i = 1; i < codigosExistentes.length; i++) {
        const actual = codigosExistentes[i];
        const anterior = codigosExistentes[i-1];
        
        // Si hay un hueco, agregar todos los valores intermedios
        if (actual - anterior > 1) {
          for (let j = anterior + 1; j < actual; j++) {
            huecos.push(j);
          }
        }
      }
      
      // Si hay suficientes huecos, usar esos
      if (huecos.length >= cantidadSolicitada) {
        codigosDisponibles.push(...huecos.slice(0, cantidadSolicitada));
      } 
      // Si no hay suficientes huecos, usar los huecos disponibles y continuar la secuencia
      else {
        // Agregar todos los huecos encontrados
        codigosDisponibles.push(...huecos);
        
        // Calcular cuántos códigos adicionales necesitamos
        const codigosFaltantes = cantidadSolicitada - huecos.length;
        
        // Continuar la secuencia desde el último código
        for (let i = 1; i <= codigosFaltantes; i++) {
          codigosDisponibles.push(ultimoCodigo + i);
        }
      }
    }
    
    // Convertir los códigos numéricos a formato de 6 dígitos
    const codigosFormateados = codigosDisponibles.map(codigo => 
      String(codigo).padStart(6, '0')
    );
    
    res.json({
      success: true,
      codigosDisponibles: codigosFormateados
    });
  } catch (error) {
    console.error('Error al buscar códigos disponibles:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la base de datos'
    });
  }
});

// Verificar si un rango de códigos está disponible
router.post('/verificar-disponibilidad', async (req, res) => {
  try {
    const { inicio, fin } = req.body;
    
    // Verificar si algún código en el rango ya existe
    const codigosExistentes = await InventarioInfo.findAll({
      attributes: ['CODIGO_BARRA'],
      where: {
        CODIGO_BARRA: {
          [Op.between]: [String(inicio).padStart(6, '0'), String(fin).padStart(6, '0')]
        }
      }
    });

    res.json({
      success: true,
      disponible: codigosExistentes.length === 0,
      codigosExistentes: codigosExistentes.map(item => item.CODIGO_BARRA)
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad de códigos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la base de datos'
    });
  }
});

module.exports = router;