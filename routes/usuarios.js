const express = require('express');
const router = express.Router();
const PdvUsuarios = require('../models/usuariosInfo');
const PdvRoles = require('../models/rolesInfo');
//const 

// Obtener todos los usuarios
  router.get('/', async (req, res) => {
    try {
      const usuarios = await PdvUsuarios.findAll({
        include: [{
          model: PdvRoles,
          as: 'Rol',
          attributes: ['DESCRIPCION_ROL']  
        }],
        attributes: {
          exclude: ['FK_ROL_USUARIO'] 
        }
      });
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: error.message });
    }
  });

// Crear un nuevo usuario
  router.post('/', async (req, res) => {
    try {
      const { FK_ROL_USUARIO, NOMBRE_USUARIO, PATERNO_USUARIO, MATERNO_USUARIO, NUMERO_USUARIO } = req.body;
      const nuevoUsuario = await PdvUsuarios.create({
        FK_ROL_USUARIO,
        NOMBRE_USUARIO,
        PATERNO_USUARIO,
        MATERNO_USUARIO,
        NUMERO_USUARIO,
        ESTATUS_USUARIO
      });
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(400).json({ message: error.message });
    }
  });

// Obtener un usuario por ID
  router.get('/:id', async (req, res) => {
    try {
      const usuario = await PdvUsuarios.findByPk(req.params.id);
      if (usuario) {
        res.json(usuario);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Actualizar un usuario
  router.put('/:id', async (req, res) => {
    try {
      const { FK_ROL_USUARIO, NOMBRE_USUARIO, PATERNO_USUARIO, MATERNO_USUARIO, NUMERO_USUARIO } = req.body;
      const [updated] = await PdvUsuarios.update({
        FK_ROL_USUARIO,
        NOMBRE_USUARIO,
        PATERNO_USUARIO,
        MATERNO_USUARIO,
        NUMERO_USUARIO
      }, {
        where: { ID_USUARIO: req.params.id }
      });
      if (updated) {
        const updatedUsuario = await PdvUsuarios.findByPk(req.params.id);
        res.json(updatedUsuario);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Eliminar un usuario
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await PdvUsuarios.destroy({
        where: { ID_USUARIO: req.params.id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: error.message });
    }
  });

// Actualizar el estado de un usuario
  router.patch('/:id/toggle-status', async (req, res) => {
    try {
      const usuario = await PdvUsuarios.findByPk(req.params.id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Cambiar el estado al opuesto del actual
      const nuevoEstado = !usuario.ESTATUS_USUARIO;
      
      await PdvUsuarios.update({
        ESTATUS_USUARIO: nuevoEstado
      }, {
        where: { ID_USUARIO: req.params.id }
      });

      // Obtener el usuario actualizado
      const usuarioActualizado = await PdvUsuarios.findByPk(req.params.id);
      res.json(usuarioActualizado);
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;