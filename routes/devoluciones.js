const express = require('express');
const router = express.Router();
const DevolucionesInfo = require('../models/DevolucionesInfo');
const InventarioInfo = require('../models/InventarioInfo');
const VentasInfo = require('../models/VentasInfo');
const SaldosFavor = require('../models/SaldosFavor');
const PdvUsuarios = require('../models/usuariosInfo');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// POST: Registrar nueva devolución
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const {
            FK_PRODUCTO,
            FK_VENTA,
            FK_VENDEDOR,
            MOTIVO,
            DESCRIPCION_MOTIVO,
            ESTADO_FINAL,
            OBSERVACIONES,
            TIPO_DEVOLUCION,
            requiereCambio
        } = req.body;

        // Validaciones
        if (!FK_PRODUCTO || !FK_VENTA || !FK_VENDEDOR || !MOTIVO) {
            throw new Error('Datos de devolución incompletos');
        }

        // Crear la devolución
        const nuevaDevolucion = await DevolucionesInfo.create({
            FK_PRODUCTO,
            FK_VENTA,
            FK_VENDEDOR,
            MOTIVO,
            DESCRIPCION_MOTIVO,
            ESTADO_FINAL,
            OBSERVACIONES,
            TIPO_DEVOLUCION: requiereCambio ? 'cambio' : 'saldo_favor',
            FECHA_DEVOLUCION: new Date()
        }, { transaction: t });

        // Actualizar estado del producto
        await InventarioInfo.update(
            { FK_ESTATUS_PRODUCTO: ESTADO_FINAL },
            { where: { PK_PRODUCTO: FK_PRODUCTO }, transaction: t }
        );

        await t.commit();
        res.status(201).json(nuevaDevolucion);

    } catch (error) {
        await t.rollback();
        console.error('Error al procesar la devolución:', error);
        res.status(500).json({ message: 'Error al procesar la devolución', error: error.message });
    }
});

// PUT: Actualizar devolución con datos de cambio
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { FK_VENTA_NUEVA, DIFERENCIA_PRECIO } = req.body;
        const devolucionId = req.params.id;

        await DevolucionesInfo.update({
            FK_VENTA_NUEVA,
            DIFERENCIA_PRECIO
        }, {
            where: { PK_DEVOLUCION: devolucionId },
            transaction: t
        });

        await t.commit();
        res.json({ message: 'Devolución actualizada correctamente' });

    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar la devolución:', error);
        res.status(500).json({ message: 'Error al actualizar la devolución', error: error.message });
    }
});

// GET: Obtener todas las devoluciones
router.get('/', async (req, res) => {
    try {
        const devoluciones = await DevolucionesInfo.findAll({
            include: [
                {
                    model: InventarioInfo,
                    as: 'Producto',
                    attributes: ['MARCA', 'MODELO', 'COLOR', 'TALLA']
                },
                {
                    model: VentasInfo,
                    as: 'VentaOriginal',
                    attributes: ['FECHA_VENTA', 'PRECIO']
                },
                {
                    model: PdvUsuarios,
                    as: 'Vendedor',
                    attributes: ['NOMBRE_USUARIO']
                }
            ],
            order: [['FECHA_DEVOLUCION', 'DESC']]
        });

        res.json(devoluciones);
    } catch (error) {
        console.error('Error al obtener devoluciones:', error);
        res.status(500).json({ message: 'Error al obtener devoluciones', error: error.message });
    }
});

// GET: Buscar producto vendido por código de barras
router.get('/producto/:codigoBarras', async (req, res) => {
    try {
        const producto = await InventarioInfo.findOne({
            where: {
                CODIGO_BARRA: req.params.codigoBarras,
                FK_ESTATUS_PRODUCTO: 2 // Vendido
            },
            include: [{
                model: VentasInfo,
                required: true
            }]
        });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado o no está vendido' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error al buscar producto:', error);
        res.status(500).json({ message: 'Error al buscar producto', error: error.message });
    }
});

module.exports = router;