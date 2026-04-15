// src/controllers/usuariosController.js
const usuariosService = require('../services/usuariosService');

class UsuariosController {

  async createUsuarios(req, res) {
    try {
      const usuario = await usuariosService.createUsuarios(req.body);
      res.status(201).json(usuario);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUsuarios(req, res) {
    try {
      const usuario = await usuariosService.getUsuarios(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateUsuarios(req, res) {
    try {
      const usuario = await usuariosService.updateUsuarios(req.params.id, req.body);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteUsuarios(req, res) {
    try {
      const usuario = await usuariosService.deleteUsuarios(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async usuariosActivos(req, res) {
    try {
      const resultado = await usuariosService.usuariosActivos();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async usuariosPorRol(req, res) {
    try {
      const resultado = await usuariosService.usuariosPorRol(req.params.rol_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async usuariosAccesoReciente(req, res) {
    try {
      const resultado = await usuariosService.usuariosAccesoReciente(req.params.dias);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UsuariosController();
