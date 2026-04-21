// src/controllers/notificacionesController.js
const notificacionesService = require('../services/notificacionesService');

class NotificacionesController {

  async createNotificaciones(req, res) {
    try {
      const notificacion = await notificacionesService.createNotificaciones(req.body);
      res.status(201).json(notificacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getNotificaciones(req, res) {
    try {
      const notificacion = await notificacionesService.getNotificaciones(req.params.id);
      if (!notificacion) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      res.json(notificacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateNotificaciones(req, res) {
    try {
      const notificacion = await notificacionesService.updateNotificaciones(req.params.id, req.body);
      if (!notificacion) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      res.json(notificacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteNotificaciones(req, res) {
    try {
      const notificacion = await notificacionesService.deleteNotificaciones(req.params.id);
      if (!notificacion) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      res.json({ message: 'Notificación eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async noLeidasPorUsuario(req, res) {
    try {
      const resultado = await notificacionesService.noLeidasPorUsuario(req.params.usuario_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async notificacionesPorPrioridad(req, res) {
    try {
      const resultado = await notificacionesService.notificacionesPorPrioridad(req.params.prioridad);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async resumenPorTipo(req, res) {
    try {
      const resultado = await notificacionesService.resumenPorTipo();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new NotificacionesController();
