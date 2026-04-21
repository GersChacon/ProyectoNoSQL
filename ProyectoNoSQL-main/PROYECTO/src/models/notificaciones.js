// src/models/notificaciones.js
const mongoose = require('mongoose');

const NotificacionesSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios',
      required: [true, 'El usuario es obligatorio'],
    },
    tipo: {
      type: String,
      required: [true, 'El tipo de notificación es obligatorio'],
      trim: true,
    },
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    mensaje: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      trim: true,
    },
    leida: {
      type: Boolean,
      default: false,
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    fecha_lectura: {
      type: Date,
      default: null,
    },
    prioridad: {
      type: String,
      enum: {
        values: ['baja', 'media', 'alta'],
        message: 'La prioridad debe ser: baja, media o alta',
      },
      default: 'media',
    },
    enlace: {
      type: String,
      trim: true,
    },
  },
  { collection: 'notificaciones' }
);

module.exports = mongoose.model('Notificaciones', NotificacionesSchema);
