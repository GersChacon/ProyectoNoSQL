// src/models/usuarios.js
const mongoose = require('mongoose');

const UsuariosSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    contrasena_hash: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    rol_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roles',
      required: [true, 'El rol es obligatorio'],
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    ultimo_acceso: {
      type: Date,
      default: null,
    },
    preferencias: {
      idioma:                  { type: String, default: 'es' },
      notificaciones_email:    { type: Boolean, default: true },
    },
  },
  { collection: 'usuarios' }
);

module.exports = mongoose.model('Usuarios', UsuariosSchema);
