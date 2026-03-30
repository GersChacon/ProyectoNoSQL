// src/services/rolesService.js
const Roles = require('../models/roles');

class RolesService {

  async createRoles(data) {
    const rol = new Roles(data);
    await rol.save();
    return rol;
  }

  async getRoles(id) {
    return await Roles.findById(id);
  }

  async updateRoles(id, data) {
    return await Roles.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteRoles(id) {
    return await Roles.findByIdAndDelete(id);
  }

  async rolesActivos() {
    return Roles.aggregate([
      { $match: { activo: true } },
      {
        $project: {
          _id: 0,
          nombre: 1,
          descripcion: 1,
          total_permisos: { $size: '$permisos' },
          permisos: 1,
        },
      },
      { $sort: { nombre: 1 } },
    ]);
  }

  async rolesPorPermiso(permiso) {
    return Roles.aggregate([
      { $match: { permisos: permiso, activo: true } },
      {
        $project: {
          _id: 0,
          nombre: 1,
          descripcion: 1,
          permisos: 1,
        },
      },
      { $sort: { nombre: 1 } },
    ]);
  }

  async resumenPermisos() {
    return Roles.aggregate([
      {
        $project: {
          _id: 0,
          nombre: 1,
          total_permisos: { $size: '$permisos' },
          activo: 1,
        },
      },
      { $sort: { total_permisos: -1 } },
    ]);
  }
}

module.exports = new RolesService();
