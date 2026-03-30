// src/services/notificacionesService.js
const Notificaciones = require('../models/notificaciones');

class NotificacionesService {

  async createNotificaciones(data) {
    const notificacion = new Notificaciones(data);
    await notificacion.save();
    return notificacion;
  }

  async getNotificaciones(id) {
    return await Notificaciones.findById(id);
  }

  async updateNotificaciones(id, data) {
    return await Notificaciones.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteNotificaciones(id) {
    return await Notificaciones.findByIdAndDelete(id);
  }

  async noLeidasPorUsuario(usuario_id) {
    const mongoose = require('mongoose');
    return Notificaciones.aggregate([
      {
        $match: {
          usuario_id: new mongoose.Types.ObjectId(usuario_id),
          leida: false,
        },
      },
      {
        $project: {
          _id: 0,
          tipo: 1,
          titulo: 1,
          mensaje: 1,
          prioridad: 1,
          fecha_creacion: 1,
          enlace: 1,
        },
      },
      { $sort: { prioridad: -1, fecha_creacion: -1 } },
    ]);
  }

  async notificacionesPorPrioridad(prioridad) {
    return Notificaciones.aggregate([
      { $match: { prioridad: prioridad } },
      {
        $project: {
          _id: 0,
          titulo: 1,
          mensaje: 1,
          leida: 1,
          fecha_creacion: 1,
        },
      },
      { $sort: { fecha_creacion: -1 } },
    ]);
  }

  async resumenPorTipo() {
    return Notificaciones.aggregate([
      {
        $group: {
          _id: '$tipo',
          total: { $sum: 1 },
          leidas: { $sum: { $cond: ['$leida', 1, 0] } },
          no_leidas: { $sum: { $cond: ['$leida', 0, 1] } },
        },
      },
      {
        $project: {
          _id: 0,
          tipo: '$_id',
          total: 1,
          leidas: 1,
          no_leidas: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }
}

module.exports = new NotificacionesService();
