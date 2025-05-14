import mongoose from 'mongoose';

const estadoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  email: { type: String },
});

export const Estado = mongoose.model('Estado', estadoSchema);