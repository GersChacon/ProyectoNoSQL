// src/models/roles.js
const mongoose = require('mongoose');

const RolesSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del rol es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    permisos: {
      type: [String],
      default: [],
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { collection: 'roles' }
);

module.exports = mongoose.model('Roles', RolesSchema);
