// src/models/asignaciones.js
const mongoose = require('mongoose');

const AsignacionesSchema = new mongoose.Schema(
  {
    recolector_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recolectores',
      required: [true, 'El recolector es obligatorio'],
    },
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fincas',
      required: [true, 'La finca es obligatoria'],
    },
    corte_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cortes',
      required: [true, 'El corte es obligatorio'],
    },
    fecha_inicio: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
    },
    fecha_fin: {
      type: Date,
      default: null,
    },
    activa: {
      type: Boolean,
      default: true,
    },
    registrado_por: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios',
      required: [true, 'El usuario que registra es obligatorio'],
    },
  },
  { collection: 'asignaciones' }
);

module.exports = mongoose.model('Asignaciones', AsignacionesSchema);
