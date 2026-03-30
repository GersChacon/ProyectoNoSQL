// src/services/auditoriaService.js
const Auditoria = require('../models/auditoria');

class AuditoriaService {

  async createAuditoria(data) {
    const registro = new Auditoria(data);
    await registro.save();
    return registro;
  }

  async getAuditoria(id) {
    return await Auditoria.findById(id);
  }

  async updateAuditoria(id, data) {
    return await Auditoria.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteAuditoria(id) {
    return await Auditoria.findByIdAndDelete(id);
  }

  async accionesPorUsuario(usuario_id) {
    const mongoose = require('mongoose');
    return Auditoria.aggregate([
      { $match: { usuario_id: new mongoose.Types.ObjectId(usuario_id) } },
      {
        $project: {
          _id: 0,
          nombre_usuario: 1,
          accion: 1,
          coleccion_afectada: 1,
          timestamp: 1,
          motivo: 1,
        },
      },
      { $sort: { timestamp: -1 } },
    ]);
  }

  async accionesPorColeccion(coleccion) {
    return Auditoria.aggregate([
      { $match: { coleccion_afectada: coleccion } },
      {
        $group: {
          _id: '$accion',
          total: { $sum: 1 },
          usuarios: { $addToSet: '$nombre_usuario' },
        },
      },
      {
        $project: {
          _id: 0,
          accion: '$_id',
          total: 1,
          usuarios: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async auditoriaReciente(limite) {
    const n = parseInt(limite) || 10;
    return Auditoria.aggregate([
      { $sort: { timestamp: -1 } },
      { $limit: n },
      {
        $project: {
          _id: 0,
          nombre_usuario: 1,
          accion: 1,
          coleccion_afectada: 1,
          ip_origen: 1,
          timestamp: 1,
          motivo: 1,
        },
      },
    ]);
  }
}

module.exports = new AuditoriaService();
