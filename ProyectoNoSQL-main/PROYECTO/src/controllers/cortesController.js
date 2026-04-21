// src/controllers/cortesController.js
const cortesService = require('../services/cortesService');

class CortesController {

  async createCortes(req, res) {
    try {
      const corte = await cortesService.createCortes(req.body);
      res.status(201).json(corte);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCortes(req, res) {
    try {
      const corte = await cortesService.getCortes(req.params.id);
      if (!corte) {
        return res.status(404).json({ error: 'Corte no encontrado' });
      }
      res.json(corte);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateCortes(req, res) {
    try {
      const corte = await cortesService.updateCortes(req.params.id, req.body);
      if (!corte) {
        return res.status(404).json({ error: 'Corte no encontrado' });
      }
      res.json(corte);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteCortes(req, res) {
    try {
      const corte = await cortesService.deleteCortes(req.params.id);
      if (!corte) {
        return res.status(404).json({ error: 'Corte no encontrado' });
      }
      res.json({ message: 'Corte eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async cortesActivos(req, res) {
    try {
      const resultado = await cortesService.cortesActivos();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async cortesPorFinca(req, res) {
    try {
      const resultado = await cortesService.cortesPorFinca(req.params.finca_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async resumenProduccion(req, res) {
    try {
      const resultado = await cortesService.resumenProduccion();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CortesController();
