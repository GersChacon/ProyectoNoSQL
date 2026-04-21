// src/controllers/asignacionesController.js
const asignacionesService = require('../services/asignacionesService');

class AsignacionesController {

  async createAsignaciones(req, res) {
    try {
      const asignacion = await asignacionesService.createAsignaciones(req.body);
      res.status(201).json(asignacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAsignaciones(req, res) {
    try {
      const asignacion = await asignacionesService.getAsignaciones(req.params.id);
      if (!asignacion) {
        return res.status(404).json({ error: 'Asignación no encontrada' });
      }
      res.json(asignacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateAsignaciones(req, res) {
    try {
      const asignacion = await asignacionesService.updateAsignaciones(req.params.id, req.body);
      if (!asignacion) {
        return res.status(404).json({ error: 'Asignación no encontrada' });
      }
      res.json(asignacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteAsignaciones(req, res) {
    try {
      const asignacion = await asignacionesService.deleteAsignaciones(req.params.id);
      if (!asignacion) {
        return res.status(404).json({ error: 'Asignación no encontrada' });
      }
      res.json({ message: 'Asignación eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async asignacionesActivas(req, res) {
    try {
      const resultado = await asignacionesService.asignacionesActivas();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async asignacionesPorFinca(req, res) {
    try {
      const resultado = await asignacionesService.asignacionesPorFinca(req.params.finca_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async asignacionesPorRecolector(req, res) {
    try {
      const resultado = await asignacionesService.asignacionesPorRecolector(req.params.recolector_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AsignacionesController();
