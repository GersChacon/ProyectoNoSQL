// src/models/recolectores.js
const mongoose = require('mongoose');

const RecolectoresSchema = new mongoose.Schema(
  {
    identificacion: {
      type: String,
      required: [true, 'La identificación es obligatoria'],
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    correo: {
      type: String,
      trim: true,
      lowercase: true,
    },
    fecha_nacimiento: {
      type: Date,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fecha_registro: {
      type: Date,
      default: Date.now,
    },
    historial_fincas: [
      {
        finca_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Fincas' },
        nombre_finca: { type: String, trim: true },
        temporadas:  { type: [String], default: [] },
      },
    ],
  },
  { collection: 'recolectores' }
);

module.exports = mongoose.model('Recolectores', RecolectoresSchema);
