const express = require('express');
const router = express.Router();
const VentasInfo = require('../models/VentasInfo');
const InventarioInfo = require('../models/InventarioInfo');
const sequelize = require('../config/database');

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

module.exports = router;