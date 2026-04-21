// src/services/asignacionesService.js
const Asignaciones = require('../models/asignaciones');

class AsignacionesService {

  async createAsignaciones(data) {
    const asignacion = new Asignaciones(data);
    await asignacion.save();
    return asignacion;
  }

  async getAsignaciones(id) {
    return await Asignaciones.findById(id);
  }

  async updateAsignaciones(id, data) {
    return await Asignaciones.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteAsignaciones(id) {
    return await Asignaciones.findByIdAndDelete(id);
  }

  // Asignaciones activas
  async asignacionesActivas() {
    return Asignaciones.aggregate([
      { $match: { activa: true } },
      {
        $lookup: {
          from: 'recolectores',
          localField: 'recolector_id',
          foreignField: '_id',
          as: 'recolector',
        },
      },
      {
        $lookup: {
          from: 'fincas',
          localField: 'finca_id',
          foreignField: '_id',
          as: 'finca',
        },
      },
      {
        $lookup: {
          from: 'cortes',
          localField: 'corte_id',
          foreignField: '_id',
          as: 'corte',
        },
      },
      { $unwind: { path: '$recolector', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$finca',      preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$corte',      preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          recolector_nombre: '$recolector.nombre',
          finca_nombre:      '$finca.nombre',
          corte_nombre:      '$corte.nombre',
          fecha_inicio:      1,
          activa:            1,
        },
      },
      { $sort: { fecha_inicio: -1 } },
    ]);
  }

  async asignacionesPorFinca(finca_id) {
    const mongoose = require('mongoose');
    return Asignaciones.aggregate([
      { $match: { finca_id: new mongoose.Types.ObjectId(finca_id) } },
      {
        $lookup: {
          from: 'recolectores',
          localField: 'recolector_id',
          foreignField: '_id',
          as: 'recolector',
        },
      },
      { $unwind: { path: '$recolector', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          recolector_nombre: '$recolector.nombre',
          fecha_inicio:      1,
          fecha_fin:         1,
          activa:            1,
        },
      },
    ]);
  }

  async asignacionesPorRecolector(recolector_id) {
    const mongoose = require('mongoose');
    return Asignaciones.aggregate([
      { $match: { recolector_id: new mongoose.Types.ObjectId(recolector_id) } },
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
          finca_nombre: '$finca.nombre',
          fecha_inicio: 1,
          fecha_fin:    1,
          activa:       1,
        },
      },
    ]);
  }
}

module.exports = new AsignacionesService();
