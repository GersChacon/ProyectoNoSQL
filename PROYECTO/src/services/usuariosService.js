// src/services/usuariosService.js
const Usuarios = require('../models/usuarios');

class UsuariosService {

  async createUsuarios(data) {
    const usuario = new Usuarios(data);
    await usuario.save();
    return usuario;
  }

  async getUsuarios(id) {
    return await Usuarios.findById(id);
  }

  async updateUsuarios(id, data) {
    return await Usuarios.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUsuarios(id) {
    return await Usuarios.findByIdAndDelete(id);
  }

  async usuariosActivos() {
    return Usuarios.aggregate([
      { $match: { activo: true } },
      {
        $lookup: {
          from: 'roles',
          localField: 'rol_id',
          foreignField: '_id',
          as: 'rol',
        },
      },
      { $unwind: { path: '$rol', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          nombre: 1,
          correo: 1,
          rol_nombre: '$rol.nombre',
          fecha_creacion: 1,
          ultimo_acceso: 1,
        },
      },
      { $sort: { nombre: 1 } },
    ]);
  }

  async usuariosPorRol(rol_id) {
    const mongoose = require('mongoose');
    return Usuarios.aggregate([
      { $match: { rol_id: new mongoose.Types.ObjectId(rol_id), activo: true } },
      {
        $project: {
          _id: 0,
          nombre: 1,
          correo: 1,
          fecha_creacion: 1,
          ultimo_acceso: 1,
        },
      },
      { $sort: { nombre: 1 } },
    ]);
  }

  async usuariosAccesoReciente(dias) {
    const n = parseInt(dias) || 30;
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - n);

    return Usuarios.aggregate([
      {
        $match: {
          activo: true,
          ultimo_acceso: { $gte: fecha },
        },
      },
      {
        $project: {
          _id: 0,
          nombre: 1,
          correo: 1,
          ultimo_acceso: 1,
        },
      },
      { $sort: { ultimo_acceso: -1 } },
    ]);
  }
}

module.exports = new UsuariosService();
