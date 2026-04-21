// src/models/auditoria.js
const mongoose = require('mongoose');

const AuditoriaSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios',
      required: [true, 'El usuario es obligatorio'],
    },
    nombre_usuario: {
      type: String,
      required: [true, 'El nombre del usuario es obligatorio'],
      trim: true,
    },
    accion: {
      type: String,
      required: [true, 'La acción es obligatoria'],
      trim: true,
    },
    coleccion_afectada: {
      type: String,
      required: [true, 'La colección afectada es obligatoria'],
      trim: true,
    },
    documento_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'El documento afectado es obligatorio'],
    },
    datos_anteriores: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    datos_nuevos: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ip_origen: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    motivo: {
      type: String,
      trim: true,
    },
  },
  { collection: 'auditoria' }
);

module.exports = mongoose.model('Auditoria', AuditoriaSchema);
