// src/models/pagos.js
const mongoose = require('mongoose');

const PagosSchema = new mongoose.Schema(
  {
    recolector_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recolectores',
      required: [true, 'El recolector es obligatorio'],
    },
    corte_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cortes',
      required: [true, 'El corte es obligatorio'],
    },
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fincas',
      required: [true, 'La finca es obligatoria'],
    },
    recolecciones_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Recolecciones',
      default: [],
    },
    total_cajuelas: {
      type: Number,
      required: [true, 'El total de cajuelas es obligatorio'],
      min: [0, 'El total de cajuelas no puede ser negativo'],
    },
    total_cuartillos: {
      type: Number,
      default: 0,
      min: [0, 'El total de cuartillos no puede ser negativo'],
    },
    monto_total: {
      type: Number,
      required: [true, 'El monto total es obligatorio'],
      min: [0, 'El monto total no puede ser negativo'],
    },
    moneda: {
      type: String,
      default: 'CRC',
      trim: true,
    },
    metodo_pago: {
      type: String,
      enum: {
        values: ['efectivo', 'transferencia', 'cheque'],
        message: 'El método de pago debe ser: efectivo, transferencia o cheque',
      },
      required: [true, 'El método de pago es obligatorio'],
    },
    estado: {
      type: String,
      enum: {
        values: ['pendiente', 'completado', 'cancelado'],
        message: 'El estado debe ser: pendiente, completado o cancelado',
      },
      default: 'pendiente',
    },
    fecha_liquidacion: {
      type: Date,
      default: null,
    },
    procesado_por: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios',
    },
    comprobante_url: {
      type: String,
      default: null,
    },
  },
  { collection: 'pagos' }
);

module.exports = mongoose.model('Pagos', PagosSchema);
