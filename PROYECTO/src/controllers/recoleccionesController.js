// src/controllers/recoleccionesController.js
const recoleccionesService = require('../services/recoleccionesService');

class RecoleccionesController {

  async createRecolecciones(req, res) {
    try {
      const recoleccion = await recoleccionesService.createRecolecciones(req.body);
      res.status(201).json(recoleccion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRecolecciones(req, res) {
    try {
      const recoleccion = await recoleccionesService.getRecolecciones(req.params.id);
      if (!recoleccion) {
        return res.status(404).json({ error: 'Recolección no encontrada' });
      }
      res.json(recoleccion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateRecolecciones(req, res) {
    try {
      const recoleccion = await recoleccionesService.updateRecolecciones(req.params.id, req.body);
      if (!recoleccion) {
        return res.status(404).json({ error: 'Recolección no encontrada' });
      }
      res.json(recoleccion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteRecolecciones(req, res) {
    try {
      const recoleccion = await recoleccionesService.deleteRecolecciones(req.params.id);
      if (!recoleccion) {
        return res.status(404).json({ error: 'Recolección no encontrada' });
      }
      res.json({ message: 'Recolección eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async recoleccionesNoPagadas(req, res) {
    try {
      const resultado = await recoleccionesService.recoleccionesNoPagadas();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async totalPorRecolector(req, res) {
    try {
      const resultado = await recoleccionesService.totalPorRecolector();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}

module.exports = new RecoleccionesController();
