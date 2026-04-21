// src/controllers/reportesController.js
const reportesService = require('../services/reportesService');

class ReportesController {

  async createReportes(req, res) {
    try {
      const reporte = await reportesService.createReportes(req.body);
      res.status(201).json(reporte);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getReportes(req, res) {
    try {
      const reporte = await reportesService.getReportes(req.params.id);
      if (!reporte) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
      }
      res.json(reporte);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateReportes(req, res) {
    try {
      const reporte = await reportesService.updateReportes(req.params.id, req.body);
      if (!reporte) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
      }
      res.json(reporte);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteReportes(req, res) {
    try {
      const reporte = await reportesService.deleteReportes(req.params.id);
      if (!reporte) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
      }
      res.json({ message: 'Reporte eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async reportesPorTipo(req, res) {
    try {
      const resultado = await reportesService.reportesPorTipo(req.params.tipo);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async resumenGeneralProduccion(req, res) {
    try {
      const resultado = await reportesService.resumenGeneralProduccion();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async reportesRecientes(req, res) {
    try {
      const resultado = await reportesService.reportesRecientes(req.params.limite);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ReportesController();
