import { Schema, model, Types } from 'mongoose';

const voluntariadoSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ['Petición', 'Oferta'],
    required: true
  },
  creadoPor: {
    type: Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

export const Voluntariado = model('Voluntariado', voluntariadoSchema);