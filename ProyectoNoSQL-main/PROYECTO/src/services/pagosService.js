// src/services/pagosService.js
const Pagos = require('../models/pagos');

class PagosService {

  async createPagos(data) {
    const pago = new Pagos(data);
    await pago.save();
    return pago;
  }

  async getPagos(id) {
    return await Pagos.findById(id);
  }

  async updatePagos(id, data) {
    return await Pagos.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePagos(id) {
    return await Pagos.findByIdAndDelete(id);
  }

  async pagosPorRecolector(recolector_id) {
    const mongoose = require('mongoose');
    return Pagos.aggregate([
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
          total_cajuelas: 1,
          monto_total: 1,
          metodo_pago: 1,
          estado: 1,
          fecha_liquidacion: 1,
        },
      },
      { $sort: { fecha_liquidacion: -1 } },
    ]);
  }

  async totalPagadoPorCorte(corte_id) {
    const mongoose = require('mongoose');
    return Pagos.aggregate([
      { $match: { corte_id: new mongoose.Types.ObjectId(corte_id) } },
      {
        $group: {
          _id: '$corte_id',
          total_pagado: { $sum: '$monto_total' },
          total_cajuelas: { $sum: '$total_cajuelas' },
          cantidad_pagos: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          total_pagado: 1,
          total_cajuelas: 1,
          cantidad_pagos: 1,
        },
      },
    ]);
  }

      async pagosPendientes() {
    return Pagos.aggregate([
      { $match: { estado: 'pendiente' } },
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
          monto_total: 1,
          metodo_pago: 1,
          estado: 1,
        },
      },
      { $sort: { monto_total: -1 } },
    ]);
  }
}

module.exports = new PagosService();
