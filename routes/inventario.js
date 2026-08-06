const express = require('express');
const router = express.Router();
const InventarioInfo = require('../models/InventarioInfo');
const VentasInfo = require('../models/VentasInfo');
const PdvUsuarios = require('../models/usuariosInfo');
const MetodosPago = require('../models/MetodosPago');
const { Op } = require('sequelize');

// Nueva ruta para buscar producto vendido por código de barras
router.get('/vendido/:codigoBarras', async (req, res) => {
  try {
    const { codigoBarras } = req.params;
    console.log('Buscando código de barras:', codigoBarras);

    const producto = await InventarioInfo.findOne({
      where: {
        CODIGO_BARRA: codigoBarras,
        FK_ESTATUS_PRODUCTO: 2 // Estado "vendido"
      },
      include: [
        {
          model: VentasInfo,
          required: true,
          attributes: ['PK_VENTA', 'FECHA_VENTA', 'PRECIO'],
          include: [
            {
              model: PdvUsuarios,
              as: 'Vendedor',
              attributes: ['NOMBRE_USUARIO']
            },
            {
              model: MetodosPago,
              as: 'MetodoPago',
              attributes: ['DESCRIPCION_METODO']
            }
          ]
        }
      ]
    });

    console.log('Producto encontrado:', JSON.stringify(producto, null, 2));

    if (producto) {
      const productoPlano = producto.get({ plain: true });

      // Ajustamos la respuesta para mantener estructura clara
      const venta = productoPlano.VentasInfos;
      const resultado = {
        ...productoPlano,
        VENTA: {
          ...venta,
          VENDEDOR: venta.Vendedor?.NOMBRE_USUARIO,
          METODO_PAGO: venta.MetodosPago?.DESCRIPCION_METODO
        }
      };

      delete resultado.VentasInfos; // Eliminamos la clave original para evitar confusión

      res.json(resultado);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar el producto vendido:', error);
    res.status(500).json({
      message: 'Error al buscar el producto',
      error: error.message
    });
  }
});

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

// Ruta para verificar si un código de barras ya existe
router.get('/verificar-codigo/:codigoBarras', async (req, res) => {
  try {
    const { codigoBarras } = req.params;

    console.log('Backend: Verificando código de barras:', codigoBarras);

    // Validar que el código tenga el formato correcto
    if (!codigoBarras || codigoBarras.trim().length === 0) {
      console.log('Backend: Código inválido');
      return res.status(400).json({
        existe: false,
        error: 'Código de barras sin digitos',
        codigo: codigoBarras
      });
    }

    const productoExistente = await InventarioInfo.findOne({
      where: {
        CODIGO_BARRA: codigoBarras.trim()
      },
      attributes: ['PK_PRODUCTO', 'MARCA', 'MODELO', 'COLOR', 'TALLA', 'CODIGO_BARRA'] // Usando PK_PRODUCTO
    });

    console.log('Backend: Producto encontrado:', productoExistente ? 'SÍ' : 'NO');

    if (productoExistente) {
      console.log('Backend: Detalles del producto:', JSON.stringify(productoExistente.toJSON(), null, 2));

      res.json({
        existe: true,
        producto: productoExistente,
        mensaje: 'Código ya existe en inventario'
      });
    } else {
      console.log('Backend: Código disponible');
      res.json({
        existe: false,
        codigo: codigoBarras,
        mensaje: 'Código disponible'
      });
    }
  } catch (error) {
    console.error('💥 Backend: Error al verificar código de barras:', error);

    res.status(500).json({
      existe: false,
      error: true,
      message: 'Error al verificar el código de barras',
      details: error.message,
      codigo: req.params.codigoBarras
    });
  }
});

// Ruta para obtener todos los productos del inventario
router.get('/', async (req, res) => {
  try {
    const inventario = await InventarioInfo.findAll({
      where: {
        STOCK: { [Op.gt]: 0 }
        //FK_ESTATUS_PRODUCTO: 1
      }
    });
    res.json(inventario);
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ruta para agregar un nuevo producto al inventario
router.post('/', async (req, res) => {
  try {
    const { marca, modelo, numero, color, precio, codigo_barra } = req.body;

    if (!marca || !modelo || !numero || !color || !precio || !codigo_barra) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const productoExistente = await InventarioInfo.findOne({
      where: { CODIGO_BARRA: codigo_barra }
    });

    if (productoExistente) {
      productoExistente.STOCK += 1;
      await productoExistente.save();

      return res.status(200).json({
        message: 'Código ya existía, se actualizó el stock',
        producto: productoExistente
      });
    }

    const nuevoProducto = await InventarioInfo.create({
      MARCA: marca,
      MODELO: modelo,
      TALLA: numero,
      COLOR: color,
      PRECIO: parseFloat(precio),
      CODIGO_BARRA: codigo_barra,
      STOCK: 1,
      FECHA_INGRESO: new Date()
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto al inventario' });
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