// src/models/fincas.js
const mongoose = require('mongoose');

const FincasSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la finca es obligatorio'],
      trim: true,
    },
    ubicacion: {
      provincia: { type: String, trim: true },
      canton:    { type: String, trim: true },
      coordenadas: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    tamano_hectareas: {
      type: Number,
      min: [0, 'El tamaño no puede ser negativo'],
    },
    propietario: {
      nombre:   { type: String, trim: true },
      telefono: { type: String, trim: true },
      correo:   { type: String, trim: true, lowercase: true },
    },
    activa: {
      type: Boolean,
      default: true,
    },
    fecha_registro: {
      type: Date,
      default: Date.now,
    },
    variedades_cafe: {
      type: [String],
      default: [],
    },
  },
  { collection: 'fincas' }
);

module.exports = mongoose.model('Fincas', FincasSchema);
