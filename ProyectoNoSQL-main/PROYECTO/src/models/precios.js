// src/models/precios.js
const mongoose = require('mongoose');

const PreciosSchema = new mongoose.Schema(
  {
    valor_cajuela: {
      type: Number,
      required: [true, 'El valor por cajuela es obligatorio'],
      min: [0, 'El valor no puede ser negativo'],
    },
    valor_cuartillo: {
      type: Number,
      required: [true, 'El valor por cuartillo es obligatorio'],
      min: [0, 'El valor no puede ser negativo'],
    },
    moneda: {
      type: String,
      default: 'CRC',
      trim: true,
    },
    vigente_desde: {
      type: Date,
      required: [true, 'La fecha de vigencia es obligatoria'],
    },
    vigente_hasta: {
      type: Date,
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    creado_por: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios',
    },
    notas: {
      type: String,
      trim: true,
    },
  },
  { collection: 'precios' }
);

module.exports = mongoose.model('Precios', PreciosSchema);
