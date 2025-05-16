import mongoose from 'mongoose';

const estadoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  email: { type: String },
});

const Estado = mongoose.models.Estado
  || mongoose.model('Estado', estadoSchema);

export default Estado;