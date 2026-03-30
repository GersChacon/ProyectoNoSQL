// src/controllers/rolesController.js
const rolesService = require('../services/rolesService');

class RolesController {

  async createRoles(req, res) {
    try {
      const rol = await rolesService.createRoles(req.body);
      res.status(201).json(rol);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRoles(req, res) {
    try {
      const rol = await rolesService.getRoles(req.params.id);
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(rol);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateRoles(req, res) {
    try {
      const rol = await rolesService.updateRoles(req.params.id, req.body);
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(rol);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteRoles(req, res) {
    try {
      const rol = await rolesService.deleteRoles(req.params.id);
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json({ message: 'Rol eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async rolesActivos(req, res) {
    try {
      const resultado = await rolesService.rolesActivos();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async rolesPorPermiso(req, res) {
    try {
      const resultado = await rolesService.rolesPorPermiso(req.params.permiso);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async resumenPermisos(req, res) {
    try {
      const resultado = await rolesService.resumenPermisos();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RolesController();
