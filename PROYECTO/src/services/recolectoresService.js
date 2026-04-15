<<<<<<< HEAD
const Recolectores = require('../models/recolectores');

class RecolectoresService {
=======
// src/services/recolectoresService.js
const Recolectores = require('../models/recolectores');

class RecolectoresService {

>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
  async createRecolectores(data) {
    const recolector = new Recolectores(data);
    await recolector.save();
    return recolector;
  }

  async getRecolectores(id) {
    return await Recolectores.findById(id);
  }

  async updateRecolectores(id, data) {
<<<<<<< HEAD
    return await Recolectores.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async deleteRecolectores(id) {
    return await Recolectores.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true, runValidators: true }
    );
  }

  async recolectoresActivos() {
    return await Recolectores.find(
      { activo: true },
      {
        _id: 1,
        identificacion: 1,
        nombre: 1,
        telefono: 1,
        correo: 1,
        fecha_nacimiento: 1,
        fecha_registro: 1,
        activo: 1
      }
    ).sort({ nombre: 1 });
=======
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
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
  }

  async recolectoresPorNombre(nombre) {
    const normalizar = (str) =>
<<<<<<< HEAD
      (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const nombreNorm = normalizar(nombre);
    const todos = await Recolectores.find().lean();

    return todos.filter((doc) => {
      const primerNombre = normalizar((doc.nombre || '').split(' ')[0] || '');
=======
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const nombreNorm = normalizar(nombre);

    const todos = await Recolectores.find().lean();

    return todos.filter((doc) => {
      const primerNombre = normalizar(doc.nombre.split(' ')[0]);
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
      return primerNombre.toLowerCase() === nombreNorm.toLowerCase();
    });
  }

  async recolectoresMultiplesFincas() {
<<<<<<< HEAD
    return await Recolectores.aggregate([
      { $match: { activo: true } },
      {
        $project: {
          _id: 1,
          nombre: 1,
          identificacion: 1,
          total_fincas: { $size: { $ifNull: ['$historial_fincas', []] } },
          historial_fincas: 1
        }
      },
      { $match: { total_fincas: { $gt: 1 } } },
      { $sort: { total_fincas: -1 } }
=======
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
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
    ]);
  }
}

<<<<<<< HEAD
module.exports = new RecolectoresService();
=======
module.exports = new RecolectoresService();
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
