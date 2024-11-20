const express = require('express');
const router = express.Router();
const VentasInfo = require('../models/VentasInfo');
const InventarioInfo = require('../models/InventarioInfo');
const PdvUsuarios = require('../models/usuariosInfo');  // Añade esta línea
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const MetodosPago = require('../models/MetodosPago');

router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      const { VENDEDOR, METODO_PAGO, OBSERVACIONES, productos } = req.body;
      
      // Validación de datos de entrada
      if (!VENDEDOR || !METODO_PAGO || !productos || !Array.isArray(productos) || productos.length === 0) {
        throw new Error('Datos de venta incompletos o inválidos');
      }

      console.log('Datos recibidos en el request:', JSON.stringify(req.body, null, 2));

      const nuevasVentas = [];
      const productosIds = productos.map(p => p.FK_PRODUCTO);

      // Obtener todos los productos del inventario en una sola consulta
      const productosInventario = await InventarioInfo.findAll({
        where: { 
          PK_PRODUCTO: productosIds,
          FK_ESTATUS_PRODUCTO: 3  // Asumiendo que 3 es "En venta"
        }
      }, { transaction: t });

      const inventarioPorId = productosInventario.reduce((acc, producto) => {
        acc[producto.PK_PRODUCTO] = producto;
        return acc;
      }, {});

      for (const producto of productos) {
        const { FK_PRODUCTO, PRECIO, OBSERVACIONES: productoObservaciones, MARCA } = producto;

        const productoInventario = inventarioPorId[FK_PRODUCTO];
        if (!productoInventario) {
          throw new Error(`Producto ${FK_PRODUCTO} no encontrado o no disponible para la venta`);
        }

        const ventaData = {
          FK_PRODUCTO,
          TALLA: productoInventario.TALLA,
          MODELO: productoInventario.MODELO,
          MARCA: MARCA || productoInventario.MARCA,
          COLOR: productoInventario.COLOR,
          PRECIO: PRECIO || productoInventario.PRECIO,
          VENDEDOR,
          METODO_PAGO,
          FECHA_VENTA: new Date(),
          OBSERVACIONES: productoObservaciones || OBSERVACIONES
        };

        console.log('Datos de la venta a insertar:', JSON.stringify(ventaData, null, 2));

        const nuevaVenta = await VentasInfo.create(ventaData, { transaction: t });
        nuevasVentas.push(nuevaVenta);

        

        // Actualizar el estado del producto en el inventario
        await InventarioInfo.update(
          { FK_ESTATUS_PRODUCTO: 2 },  // Asumiendo que 2 significa "vendido"
          { where: { PK_PRODUCTO: FK_PRODUCTO }, transaction: t }
        );
      }

      await t.commit();
      
      console.log('Ventas creadas:', JSON.stringify(nuevasVentas.map(v => v.toJSON()), null, 2));
      
      res.status(201).json({ message: 'Ventas registradas con éxito', ventas: nuevasVentas });

    } catch (error) {
      await t.rollback();
      console.error('Error al realizar la venta:', error);
      res.status(500).json({ message: 'Error al procesar la venta', error: error.message });
    }
});

router.get('/', async (req, res) => {
  const { periodo } = req.query;
  let whereClause = {};

  const now = new Date();
  switch(periodo) {
    case 'hoy':
      whereClause.FECHA_VENTA = {
        [Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      };
      break;
    case 'semana':
      whereClause.FECHA_VENTA = {
        [Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      };
      break;
    case 'mensual':
      whereClause.FECHA_VENTA = {
        [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1)
      };
      break;
    case 'anual':
      whereClause.FECHA_VENTA = {
        [Op.gte]: new Date(now.getFullYear(), 0, 1)
      };
      break;
  }

  try {
    const ventas = await VentasInfo.findAll({
      where: whereClause,
      attributes: ['MARCA', 'TALLA', 'COLOR', 'PRECIO', 'METODO_PAGO', 'FECHA_VENTA', 'OBSERVACIONES'],
      include: [{
        model: PdvUsuarios,
        as: 'Vendedor',
        attributes: ['NOMBRE_USUARIO']
      }]
    });
    
    const ventasFormateadas = ventas.map(venta => ({
      ...venta.get({ plain: true }),
      VENDEDOR: venta.Vendedor ? venta.Vendedor.NOMBRE_USUARIO : 'Desconocido'
    }));

    console.log('Ventas encontradas:', ventasFormateadas.length);
    res.json(ventasFormateadas);
  } catch (error) {
    console.error('Error fetching ventas:', error);
    res.status(500).json({ message: 'Error al obtener datos de ventas' });
  }
});

router.get('/orden/:ordenId', async (req, res) => {
  try {
    const venta = await VentasInfo.findOne({
      where: {
        FK_ORDEN: req.params.ordenId
      }
    });

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Log para debugging
    console.log('Venta encontrada:', venta);

    res.json(venta);
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ message: 'Error al obtener venta' });
  }
});

router.get('/historial', async (req, res) => {
  try {
    const ventas = await VentasInfo.findAll({
      attributes: [
        'PK_VENTA',
        'MARCA', 
        'TALLA',
        'MODELO', 
        'COLOR',
        'PRECIO',
        'FECHA_VENTA',
        'OBSERVACIONES'
      ],
      include: [
        {
          model: PdvUsuarios,
          as: 'Vendedor',
          attributes: ['NOMBRE_USUARIO']
        },
        {
          model: MetodosPago, // Asegúrate de tener importado el modelo
          as: 'MetodoPago',
          attributes: ['DESCRIPCION_METODO']
        }
      ],
      order: [['FECHA_VENTA', 'DESC']]
    });
 
    const ventasFormateadas = ventas.map(venta => ({
      ...venta.get({ plain: true }),
      VENDEDOR: venta.Vendedor ? venta.Vendedor.NOMBRE_USUARIO : 'Desconocido',
      METODO_PAGO: venta.MetodoPago ? venta.MetodoPago.DESCRIPCION_METODO : 'Desconocido'
    }));
    
    res.json(ventasFormateadas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' });
  }
 });


module.exports = router;