const Reportes = require('../models/reportes');

class ReportesService {

  async createReportes(data) {
    const reporte = new Reportes(data);
    await reporte.save();
    return reporte;
  }

  async getReportes(id) {
    return await Reportes.findById(id);
  }

  async updateReportes(id, data) {
    return await Reportes.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteReportes(id) {
    return await Reportes.findByIdAndDelete(id);
  }

  async reportesPorTipo(tipo) {
    return Reportes.aggregate([
      { $match: { tipo: { $regex: new RegExp(tipo, 'i') } } },
      {
        $project: {
          _id: 0,
          titulo: 1,
          formato: 1,
          'resumen.total_recolectores': 1,
          'resumen.total_cajuelas': 1,
          'resumen.total_pagado': 1,
          generado_en: 1,
        },
      },
      { $sort: { generado_en: -1 } },
    ]);
  }

  async resumenGeneralProduccion() {
    return Reportes.aggregate([
      {
        $group: {
          _id: '$tipo',
          total_reportes: { $sum: 1 },
          total_cajuelas: { $sum: '$resumen.total_cajuelas' },
          total_pagado:   { $sum: '$resumen.total_pagado' },
        },
      },
      {
        $project: {
          _id: 0,
          tipo: '$_id',
          total_reportes: 1,
          total_cajuelas: 1,
          total_pagado: 1,
        },
      },
      { $sort: { total_cajuelas: -1 } },
    ]);
  }

  async reportesRecientes(limite) {
    const n = parseInt(limite) || 5;
    return Reportes.aggregate([
      { $sort: { generado_en: -1 } },
      { $limit: n },
      {
        $project: {
          _id: 0,
          titulo: 1,
          tipo: 1,
          formato: 1,
          url_archivo: 1,
          generado_en: 1,
        },
      },
    ]);
  }
}

module.exports = new ReportesService();
