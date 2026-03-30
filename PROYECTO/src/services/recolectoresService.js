// src/services/recolectoresService.js
const Recolectores = require('../models/recolectores');

class RecolectoresService {

  async createRecolectores(data) {
    const recolector = new Recolectores(data);
    await recolector.save();
    return recolector;
  }

  async getRecolectores(id) {
    return await Recolectores.findById(id);
  }

  async updateRecolectores(id, data) {
    return await Recolectores.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteRecolectores(id) {
    return await Recolectores.findByIdAndDelete(id);
  }

  async recolectoresActivos() {
    return Recolectores.aggregate([
      { $match: { activo: true } },
      {
        $project: {
          _id: 0,
          identificacion: 1,
          nombre: 1,
          telefono: 1,
          correo: 1,
          fecha_registro: 1,
        },
      },
      { $sort: { nombre: 1 } },
    ]);
  }

  async recolectoresPorNombre(nombre) {
    const normalizar = (str) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const nombreNorm = normalizar(nombre);

    const todos = await Recolectores.find().lean();

    return todos.filter((doc) => {
      const primerNombre = normalizar(doc.nombre.split(' ')[0]);
      return primerNombre.toLowerCase() === nombreNorm.toLowerCase();
    });
  }

  async recolectoresMultiplesFincas() {
    return Recolectores.aggregate([
      { $match: { activo: true } },
      {
        $project: {
          _id: 0,
          nombre: 1,
          identificacion: 1,
          total_fincas: { $size: '$historial_fincas' },
          historial_fincas: 1,
        },
      },
      { $match: { total_fincas: { $gt: 1 } } },
      { $sort: { total_fincas: -1 } },
    ]);
  }
}

module.exports = new RecolectoresService();
