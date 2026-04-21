// src/models/reportes.js
const mongoose = require('mongoose');

const ReportesSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, 'El tipo de reporte es obligatorio'],
      trim: true,
    },
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    parametros: {
      finca_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Fincas' },
      corte_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Cortes' },
      fecha_desde: { type: Date },
      fecha_hasta: { type: Date },
    },
    resumen: {
      total_recolectores: { type: Number, default: 0 },
      total_cajuelas:     { type: Number, default: 0 },
      total_pagado:       { type: Number, default: 0 },
    },
    formato: {
      type: String,
      enum: {
        values: ['PDF', 'XLSX', 'CSV'],
        message: 'El formato debe ser: PDF, XLSX o CSV',
      },
      default: 'PDF',
    },
    url_archivo: {
      type: String,
      trim: true,
    },
    generado_por: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios',
    },
    generado_en: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'reportes' }
);

module.exports = mongoose.model('Reportes', ReportesSchema);
