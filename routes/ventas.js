const express = require('express');
const router = express.Router();
const VentasInfo = require('../models/VentasInfo');
const InventarioInfo = require('../models/InventarioInfo');
const PdvUsuarios = require('../models/usuariosInfo');  // Añade esta línea
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const MetodosPago = require('../models/MetodosPago');
const EstatusVenta = require('../models/EstatusVenta');

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
          OBSERVACIONES: productoObservaciones || OBSERVACIONES,
          FK_ESTATUS_VENTA: 1 
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
        [Op.gte]: new Date(now.getFullYear(), now.getMonth() - 12, 1)
      };
      break;
  }

  try {
    const ventas = await VentasInfo.findAll({
      where: whereClause,
      attributes: ['PK_VENTA', 'MARCA', 'TALLA', 'COLOR', 'PRECIO', 'METODO_PAGO', 'FECHA_VENTA', 'OBSERVACIONES', 'FK_PRODUCTO'],
      include: [
        {
          model: PdvUsuarios,
          as: 'Vendedor',
          attributes: ['NOMBRE_USUARIO']
        },
        {
          model: InventarioInfo,
          as: 'Producto',
          attributes: ['CODIGO_BARRA']
        }
      ]
    });
    
    const ventasFormateadas = ventas.map(venta => ({
      ...venta.get({ plain: true }),
      VENDEDOR: venta.Vendedor ? venta.Vendedor.NOMBRE_USUARIO : 'Desconocido',
      CODIGO_BARRA: venta.Producto ? venta.Producto.CODIGO_BARRA : 'Sin código'
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
    const { estado } = req.query;
    let whereClause = {};

    if (estado) {
      if (estado === 'FINALIZADA') {
        whereClause.FK_ESTATUS_VENTA = 1;
      } else if (estado === 'DEVOLUCIÓN') {
        whereClause.FK_ESTATUS_VENTA = 2;
      }
    }

    const ventas = await VentasInfo.findAll({
      where: whereClause,
      attributes: [
        'PK_VENTA',
        'MARCA', 
        'TALLA',
        'MODELO', 
        'COLOR',
        'PRECIO',
        'FECHA_VENTA',
        'OBSERVACIONES',
        'FK_ESTATUS_VENTA'
      ],
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
        },
        {
          model: InventarioInfo,
          as: 'Producto',
          attributes: ['CODIGO_BARRA']
        },
        {
          model: EstatusVenta,
          as: 'Estatus',
          attributes: ['DESCRIPCION']
        }
      ],
      order: [['FECHA_VENTA', 'DESC']]
    });

    const ventasFormateadas = ventas.map(venta => ({
      ...venta.get({ plain: true }),
      VENDEDOR: venta.Vendedor ? venta.Vendedor.NOMBRE_USUARIO : 'Desconocido',
      METODO_PAGO: venta.MetodoPago ? venta.MetodoPago.DESCRIPCION_METODO : 'Desconocido',
      CODIGO_BARRA: venta.Producto ? venta.Producto.CODIGO_BARRA : 'Sin código',
      ESTATUS: venta.Estatus ? venta.Estatus.DESCRIPCION : 'Sin estatus'
    }));
    
    res.json(ventasFormateadas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
});

router.put('/:ventaId', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { ventaId } = req.params;
    const { FK_ESTATUS_VENTA } = req.body;

    // Validar que el ID de venta existe
    const ventaExistente = await VentasInfo.findByPk(ventaId);
    if (!ventaExistente) {
      await t.rollback();
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Validar que el nuevo estatus sea válido (1 o 2)
    if (![1, 2].includes(FK_ESTATUS_VENTA)) {
      await t.rollback();
      return res.status(400).json({ 
        message: 'Estado de venta inválido. Los valores permitidos son 1 (Finalizada) o 2 (Devolución)' 
      });
    }

    // Actualizar el estado de la venta
    await VentasInfo.update(
      { 
        FK_ESTATUS_VENTA,
        // Podemos agregar más campos si se necesitan actualizar
      },
      { 
        where: { PK_VENTA: ventaId },
        transaction: t
      }
    );

    // Log para debugging
    console.log(`Venta ${ventaId} actualizada con estatus ${FK_ESTATUS_VENTA}`);

    await t.commit();
    
    // Obtener la venta actualizada para confirmar los cambios
    const ventaActualizada = await VentasInfo.findByPk(ventaId, {
      include: [
        {
          model: PdvUsuarios,
          as: 'Vendedor',
          attributes: ['NOMBRE_USUARIO']
        }
      ]
    });

    res.json({ 
      message: 'Estado de venta actualizado correctamente',
      venta: ventaActualizada 
    });

  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar estado de venta:', error);
    res.status(500).json({ 
      message: 'Error al actualizar estado de venta',
      error: error.message 
    });
  }
});


module.exports = router;