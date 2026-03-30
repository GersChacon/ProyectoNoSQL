// src/models/cortes.js
const mongoose = require('mongoose');

const CortesSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del corte es obligatorio'],
      trim: true,
    },
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fincas',
      required: [true, 'La finca es obligatoria'],
    },
    fecha_inicio: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
    },
    fecha_fin: {
      type: Date,
      default: null,
    },
    estado: {
      type: String,
      enum: {
        values: ['activo', 'finalizado', 'cancelado'],
        message: 'El estado debe ser: activo, finalizado o cancelado',
      },
      default: 'activo',
    },
    total_cajuelas: {
      type: Number,
      default: 0,
      min: [0, 'El total de cajuelas no puede ser negativo'],
    },
    total_pagado: {
      type: Number,
      default: 0,
      min: [0, 'El total pagado no puede ser negativo'],
    },
    notas: {
      type: String,
      trim: true,
    },
  },
  { collection: 'cortes' }
);

module.exports = mongoose.model('Cortes', CortesSchema);
