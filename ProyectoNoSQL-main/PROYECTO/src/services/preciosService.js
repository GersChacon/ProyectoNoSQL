// src/services/preciosService.js
const Precios = require('../models/precios');

class PreciosService {

  async createPrecios(data) {
    const precio = new Precios(data);
    await precio.save();
    return precio;
  }

  async getPrecios(id) {
    return await Precios.findById(id);
  }

  async updatePrecios(id, data) {
    return await Precios.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePrecios(id) {
    return await Precios.findByIdAndDelete(id);
  }

  async precioVigente() {
    return Precios.aggregate([
      { $match: { activo: true } },
      { $sort: { vigente_desde: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          valor_cajuela: 1,
          valor_cuartillo: 1,
          moneda: 1,
          vigente_desde: 1,
          notas: 1,
        },
      },
    ]);
  }

  async historialPrecios() {
    return Precios.aggregate([
      { $sort: { vigente_desde: -1 } },
      {
        $project: {
          _id: 0,
          valor_cajuela: 1,
          valor_cuartillo: 1,
          moneda: 1,
          vigente_desde: 1,
          vigente_hasta: 1,
          activo: 1,
          notas: 1,
        },
      },
    ]);
  }

  async promedioValorCajuela() {
    return Precios.aggregate([
      {
        $group: {
          _id: null,
          promedio_cajuela: { $avg: '$valor_cajuela' },
          max_cajuela: { $max: '$valor_cajuela' },
          min_cajuela: { $min: '$valor_cajuela' },
          total_registros: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          promedio_cajuela: { $round: ['$promedio_cajuela', 2] },
          max_cajuela: 1,
          min_cajuela: 1,
          total_registros: 1,
        },
      },
    ]);
  }
}

module.exports = new PreciosService();
