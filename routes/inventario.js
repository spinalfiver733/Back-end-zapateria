const express = require('express');
const router = express.Router();
const InventarioInfo = require('../models/InventarioInfo');
const VentasInfo = require('../models/VentasInfo');
const PdvUsuarios = require('../models/usuariosInfo');
const MetodosPago = require('../models/MetodosPago');


// Nueva ruta para buscar producto vendido por código de barras (DEBE IR ANTES DE /:id)
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
          attributes: ['PK_VENTA', 'FECHA_VENTA', 'PRECIO'], // Solo lo necesario
          include: [
            {
              model: PdvUsuarios,
              as: 'Vendedor', // Alias configurado en asociaciones
              attributes: ['NOMBRE_USUARIO'] // Obtenemos el nombre del vendedor
            },
            {
              model: MetodosPago,
              as: 'MetodoPago', // Alias definido en associations.js
              attributes: ['DESCRIPCION_METODO'] // Obtenemos la descripción del método
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

    console.log('🔍 Backend: Verificando código de barras:', codigoBarras);

    // Validar que el código tenga el formato correcto
    if (!codigoBarras || codigoBarras.trim().length !== 6) {
      console.log('❌ Backend: Código inválido (no tiene 6 dígitos)');
      return res.status(400).json({
        existe: false,
        error: 'Código de barras debe tener 6 dígitos',
        codigo: codigoBarras
      });
    }

    const productoExistente = await InventarioInfo.findOne({
      where: {
        CODIGO_BARRA: codigoBarras.trim()
      },
      attributes: ['PK_PRODUCTO', 'MARCA', 'MODELO', 'COLOR', 'TALLA', 'CODIGO_BARRA'] // Usando PK_PRODUCTO
    });

    console.log('📋 Backend: Producto encontrado:', productoExistente ? 'SÍ' : 'NO');

    if (productoExistente) {
      console.log('📋 Backend: Detalles del producto:', JSON.stringify(productoExistente.toJSON(), null, 2));

      res.json({
        existe: true,
        producto: productoExistente,
        mensaje: 'Código ya existe en inventario'
      });
    } else {
      console.log('✅ Backend: Código disponible');
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

// Ruta para obtener productos sin procesar (estatus 3)
router.get('/sin-procesar', async (req, res) => {
  try {
    const productosSinProcesar = await InventarioInfo.findAll({
      where: {
        FK_ESTATUS_PRODUCTO: 3
      },
      order: [['FECHA_INGRESO', 'DESC']] // Ordenar por fecha más reciente primero
    });

    console.log(`Productos sin procesar encontrados: ${productosSinProcesar.length}`);
    res.json(productosSinProcesar);
  } catch (error) {
    console.error('Error al obtener productos sin procesar:', error);
    res.status(500).json({
      message: 'Error al obtener productos sin procesar',
      error: error.message
    });
  }
});

// Ruta para regresar TODOS los productos sin procesar al inventario (estatus 3 -> 1)
router.put('/regresar-todos', async (req, res) => {
  try {
    // Primero verificamos cuántos productos hay en estatus 3
    const productosEnEstatus3 = await InventarioInfo.count({
      where: {
        FK_ESTATUS_PRODUCTO: 3
      }
    });

    if (productosEnEstatus3 === 0) {
      return res.status(404).json({
        message: 'No hay productos sin procesar para regresar al inventario'
      });
    }

    // Actualizar todos los productos de estatus 3 a estatus 1
    const [filasActualizadas] = await InventarioInfo.update(
      { FK_ESTATUS_PRODUCTO: 1 },
      {
        where: { FK_ESTATUS_PRODUCTO: 3 },
        returning: true // Para PostgreSQL, en MySQL no es necesario
      }
    );

    console.log(`Productos regresados al inventario: ${filasActualizadas}`);

    res.json({
      message: `Los productos han sido regresados al inventario exitosamente`,
      productosActualizados: filasActualizadas
    });

  } catch (error) {
    console.error('Error al regresar productos al inventario:', error);
    res.status(500).json({
      message: 'Error al regresar productos al inventario',
      error: error.message
    });
  }
});

// Ruta para obtener todos los productos del inventario
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

// Ruta para agregar un nuevo producto al inventario
router.post('/', async (req, res) => {
  try {
    const { marca, modelo, numero, color, precio, codigo_barra } = req.body;

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