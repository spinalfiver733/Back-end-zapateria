const express = require('express');
const router = express.Router();
const PdvRoles = require('../models/rolesInfo');

// Obtener todos los roles
router.get('/', async (req, res) => {
  try {
    const roles = await PdvRoles.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo rol
router.post('/', async (req, res) => {
  try {
    const { DESCRIPCION_ROL } = req.body;
    const nuevoRol = await PdvRoles.create({ DESCRIPCION_ROL });
    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(400).json({ message: error.message });
  }
});

// Obtener un rol por ID
router.get('/:id', async (req, res) => {
  try {
    const rol = await PdvRoles.findByPk(req.params.id);
    if (rol) {
      res.json(rol);
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener rol:', error);
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un rol
router.put('/:id', async (req, res) => {
  try {
    const { DESCRIPCION_ROL } = req.body;
    const [updated] = await PdvRoles.update({ DESCRIPCION_ROL }, {
      where: { ID_ROL: req.params.id }
    });
    if (updated) {
      const updatedRol = await PdvRoles.findByPk(req.params.id);
      res.json(updatedRol);
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un rol
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PdvRoles.destroy({
      where: { ID_ROL: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;