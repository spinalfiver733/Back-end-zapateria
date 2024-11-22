const express = require('express');
const router = express.Router();
const SaldosFavor = require('../models/SaldosFavor');
const DevolucionesInfo = require('../models/DevolucionesInfo');
const sequelize = require('../config/database');

// POST: Crear nuevo saldo a favor
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { FK_DEVOLUCION, CODIGO_UNICO, MONTO } = req.body;

        if (!FK_DEVOLUCION || !CODIGO_UNICO || !MONTO) {
            throw new Error('Datos de saldo incompletos');
        }

        const nuevoSaldo = await SaldosFavor.create({
            FK_DEVOLUCION,
            CODIGO_UNICO,
            MONTO,
            ESTADO: 'activo',
            FECHA_CREACION: new Date()
        }, { transaction: t });

        await t.commit();
        res.status(201).json(nuevoSaldo);

    } catch (error) {
        await t.rollback();
        console.error('Error al crear saldo a favor:', error);
        res.status(500).json({ message: 'Error al crear saldo a favor', error: error.message });
    }
});

// GET: Consultar saldo por código
router.get('/:codigo', async (req, res) => {
    try {
        const saldo = await SaldosFavor.findOne({
            where: {
                CODIGO_UNICO: req.params.codigo,
                ESTADO: 'activo'
            },
            include: [{
                model: DevolucionesInfo,
                as: 'Devolucion',
                include: ['Producto']
            }]
        });

        if (!saldo) {
            return res.status(404).json({ message: 'Saldo no encontrado o ya utilizado' });
        }

        res.json(saldo);
    } catch (error) {
        console.error('Error al consultar saldo:', error);
        res.status(500).json({ message: 'Error al consultar saldo', error: error.message });
    }
});

//Actualizar estado del saldo (usar saldo)
router.put('/:codigo/usar', async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { FK_VENTA_USO } = req.body;
        const codigo = req.params.codigo;

        const saldo = await SaldosFavor.findOne({
            where: {
                CODIGO_UNICO: codigo,
                ESTADO: 'activo',
                ESTATUS_SALDO_VENTA: 1 // Saldo disponible
            },
            transaction: t
        });

        if (!saldo) {
            throw new Error('Saldo no encontrado o ya utilizado');
        }

        await saldo.update({
            ESTADO: 'usado',
            FK_VENTA_USO,
            ESTATUS_SALDO_VENTA: 0 // Saldo ya no disponible
        }, { transaction: t });

        await t.commit();
        res.json({ message: 'Saldo utilizado correctamente' });

    } catch (error) {
        await t.rollback();
        console.error('Error al usar saldo:', error);
        res.status(500).json({ message: 'Error al usar saldo', error: error.message });
    }
});

//Obtener historial de saldos
router.get('/historial/todos', async (req, res) => {
    try {
        const saldos = await SaldosFavor.findAll({
            include: [{
                model: DevolucionesInfo,
                as: 'Devolucion',
                include: ['Producto', 'Vendedor']
            }],
            order: [['FECHA_CREACION', 'DESC']]
        });

        res.json(saldos);
    } catch (error) {
        console.error('Error al obtener historial de saldos:', error);
        res.status(500).json({ message: 'Error al obtener historial de saldos', error: error.message });
    }
});

module.exports = router;