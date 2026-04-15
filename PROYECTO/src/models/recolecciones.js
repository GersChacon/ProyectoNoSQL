// src/models/recolecciones.js
const mongoose = require('mongoose');

const RecoleccionesSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
    },
    recolector: {
      id:              { type: mongoose.Schema.Types.ObjectId, ref: 'Recolectores' },
      nombre:          { type: String, trim: true },
      identificacion:  { type: String, trim: true },
    },
    finca: {
      id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Fincas' },
      nombre: { type: String, trim: true },
    },
    corte: {
      id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Cortes' },
      nombre: { type: String, trim: true },
    },
    precio_aplicado: {
      id:               { type: mongoose.Schema.Types.ObjectId, ref: 'Precios' },
      valor_cajuela:    { type: Number },
      valor_cuartillo:  { type: Number },
      moneda:           { type: String, trim: true },
    },
    cantidad_cajuelas: {
      type: Number,
      required: [true, 'La cantidad de cajuelas es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
    },
    cantidad_cuartillos: {
      type: Number,
      default: 0,
      min: [0, 'La cantidad no puede ser negativa'],
    },
    pago_total: {
      type: Number,
      required: [true, 'El pago total es obligatorio'],
      min: [0, 'El pago no puede ser negativo'],
    },
    pagado: {
      type: Boolean,
      default: false,
    },
    registrado_por: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios',
    },
    creado_en: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'recolecciones' }
);

module.exports = mongoose.model('Recolecciones', RecoleccionesSchema);
