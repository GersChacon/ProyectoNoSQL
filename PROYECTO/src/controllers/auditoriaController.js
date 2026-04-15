// src/controllers/auditoriaController.js
const auditoriaService = require('../services/auditoriaService');

class AuditoriaController {

  async createAuditoria(req, res) {
    try {
      const registro = await auditoriaService.createAuditoria(req.body);
      res.status(201).json(registro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAuditoria(req, res) {
    try {
      const registro = await auditoriaService.getAuditoria(req.params.id);
      if (!registro) {
        return res.status(404).json({ error: 'Registro de auditoría no encontrado' });
      }
      res.json(registro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateAuditoria(req, res) {
    try {
      const registro = await auditoriaService.updateAuditoria(req.params.id, req.body);
      if (!registro) {
        return res.status(404).json({ error: 'Registro de auditoría no encontrado' });
      }
      res.json(registro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteAuditoria(req, res) {
    try {
      const registro = await auditoriaService.deleteAuditoria(req.params.id);
      if (!registro) {
        return res.status(404).json({ error: 'Registro de auditoría no encontrado' });
      }
      res.json({ message: 'Registro de auditoría eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async accionesPorUsuario(req, res) {
    try {
      const resultado = await auditoriaService.accionesPorUsuario(req.params.usuario_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async accionesPorColeccion(req, res) {
    try {
      const resultado = await auditoriaService.accionesPorColeccion(req.params.coleccion);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async auditoriaReciente(req, res) {
    try {
      const resultado = await auditoriaService.auditoriaReciente(req.params.limite);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AuditoriaController();
