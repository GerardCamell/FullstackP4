import mongoose from 'mongoose';

const voluntariadoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  usuario: { type: String, required: true },
  fecha: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, required: true },
});

export const Voluntariado = mongoose.model('Voluntariado', voluntariadoSchema);