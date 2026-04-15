// src/services/recoleccionesService.js
const Recolecciones = require('../models/recolecciones');

class RecoleccionesService {

  async createRecolecciones(data) {
    const recoleccion = new Recolecciones(data);
    await recoleccion.save();
    return recoleccion;
  }

  async getRecolecciones(id) {
    return await Recolecciones.findById(id);
  }

  async updateRecolecciones(id, data) {
    return await Recolecciones.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteRecolecciones(id) {
    return await Recolecciones.findByIdAndDelete(id);
  }

  async recoleccionesNoPagadas() {
    return Recolecciones.aggregate([
      { $match: { pagado: false } },
      {
        $project: {
          _id: 0,
          fecha: 1,
          'recolector.nombre': 1,
          'finca.nombre': 1,
          cantidad_cajuelas: 1,
          cantidad_cuartillos: 1,
          pago_total: 1,
        },
      },
      { $sort: { fecha: -1 } },
    ]);
  }

  async totalPorRecolector() {
    return Recolecciones.aggregate([
      {
        $group: {
          _id: '$recolector.id',
          nombre: { $first: '$recolector.nombre' },
          total_cajuelas: { $sum: '$cantidad_cajuelas' },
          total_cuartillos: { $sum: '$cantidad_cuartillos' },
          total_pago: { $sum: '$pago_total' },
          total_recolecciones: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          nombre: 1,
          total_cajuelas: 1,
          total_cuartillos: 1,
          total_pago: 1,
          total_recolecciones: 1,
        },
      },
      { $sort: { total_cajuelas: -1 } },
    ]);
  }

}

module.exports = new RecoleccionesService();
