const Fincas = require('../models/fincas');

class FincasService {
  async createFincas(data) {
    const finca = new Fincas(data);
    await finca.save();
    return finca;
  }

  async getFincas(id) {
    return await Fincas.findById(id);
  }

  async updateFincas(id, data) {
    return await Fincas.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async deleteFincas(id) {
    return await Fincas.findByIdAndUpdate(
      id,
      { activa: false },
      { new: true, runValidators: true }
    );
  }

  async fincasActivas() {
    return await Fincas.find(
      { activa: true },
      {
        _id: 1,
        nombre: 1,
        ubicacion: 1,
        tamano_hectareas: 1,
        propietario: 1,
        variedades_cafe: 1,
        activa: 1,
        fecha_registro: 1
      }
    ).sort({ nombre: 1 });
  }

  async fincasPorProvincia(provincia) {
    return await Fincas.find(
      {
        'ubicacion.provincia': { $regex: new RegExp(provincia, 'i') }
      },
      {
        _id: 1,
        nombre: 1,
        ubicacion: 1,
        tamano_hectareas: 1,
        propietario: 1,
        activa: 1
      }
    ).sort({ nombre: 1 });
  }

  async promedioTamano() {
    return await Fincas.aggregate([
      { $match: { activa: true } },
      {
        $group: {
          _id: null,
          promedio_hectareas: { $avg: '$tamano_hectareas' },
          total_fincas: { $sum: 1 },
          max_hectareas: { $max: '$tamano_hectareas' },
          min_hectareas: { $min: '$tamano_hectareas' }
        }
      },
      {
        $project: {
          _id: 0,
          total_fincas: 1,
          promedio_hectareas: { $round: ['$promedio_hectareas', 2] },
          max_hectareas: 1,
          min_hectareas: 1
        }
      }
    ]);
  }
}

module.exports = new FincasService();