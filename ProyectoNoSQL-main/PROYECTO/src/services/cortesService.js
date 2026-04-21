// src/services/cortesService.js
const Cortes = require('../models/cortes');

class CortesService {

  async createCortes(data) {
    const corte = new Cortes(data);
    await corte.save();
    return corte;
  }

  async getCortes(id) {
    return await Cortes.findById(id);
  }

  async updateCortes(id, data) {
    return await Cortes.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCortes(id) {
    return await Cortes.findByIdAndDelete(id);
  }

  async cortesActivos() {
    return Cortes.aggregate([
      { $match: { estado: 'activo' } },
      {
        $lookup: {
          from: 'fincas',
          localField: 'finca_id',
          foreignField: '_id',
          as: 'finca',
        },
      },
      { $unwind: { path: '$finca', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          nombre: 1,
          finca_nombre: '$finca.nombre',
          fecha_inicio: 1,
          fecha_fin: 1,
          total_cajuelas: 1,
          total_pagado: 1,
          estado: 1,
        },
      },
      { $sort: { fecha_inicio: -1 } },
    ]);
  }

  async cortesPorFinca(finca_id) {
    const mongoose = require('mongoose');
    return Cortes.aggregate([
      { $match: { finca_id: new mongoose.Types.ObjectId(finca_id) } },
      {
        $project: {
          _id: 0,
          nombre: 1,
          fecha_inicio: 1,
          fecha_fin: 1,
          estado: 1,
          total_cajuelas: 1,
          total_pagado: 1,
        },
      },
      { $sort: { fecha_inicio: -1 } },
    ]);
  }

  async resumenProduccion() {
    return Cortes.aggregate([
      {
        $group: {
          _id: '$estado',
          total_cortes: { $sum: 1 },
          total_cajuelas: { $sum: '$total_cajuelas' },
          total_pagado: { $sum: '$total_pagado' },
        },
      },
      {
        $project: {
          _id: 0,
          estado: '$_id',
          total_cortes: 1,
          total_cajuelas: 1,
          total_pagado: 1,
        },
      },
    ]);
  }
}

module.exports = new CortesService();
