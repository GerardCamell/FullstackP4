// backend/controllers/voluntariadoController.js
import Voluntariado from '../models/voluntariado.js';

// Crear nuevo voluntariado\
export async function crearVoluntariado(req, res) {
  try {
    const { titulo, descripcion, fecha, tipo } = req.body;
    const userId = req.session.user.id;
    const nuevo = await Voluntariado.create({
      titulo,
      descripcion,
      fecha: fecha ? new Date(fecha) : undefined,
      tipo,
      creadoPor: userId
    });
    
    // Emitir evento de creación en tiempo real
    if (req.io) {
      req.io.emit('voluntariadoCreado', nuevo);
    }

    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Listar voluntariados (admin ve todos, usuario solo los suyos)
export async function listarVoluntariados(req, res) {
  try {
    const { role, id } = req.session.user;
    const filtro = role === 'admin' ? {} : { creadoPor: id };
    const lista = await Voluntariado.find(filtro)
      .populate('creadoPor', 'name email role');
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Obtener un voluntariado por ID con control de acceso
export async function obtenerVoluntariado(req, res) {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.session.user;
    const query = { _id: id };
    if (role !== 'admin') query.creadoPor = userId;
    const vol = await Voluntariado.findOne(query)
      .populate('creadoPor', 'name email role');
    if (!vol) return res.status(404).json({ error: 'No encontrado' });
    res.json(vol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Actualizar voluntariado
export async function actualizarVoluntariado(req, res) {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.session.user;
    const datos = req.body;
    const query = { _id: id };
    if (role !== 'admin') query.creadoPor = userId;
    const vol = await Voluntariado.findOneAndUpdate(query, datos, {
      new: true,
      runValidators: true
    }).populate('creadoPor', 'name email role');
    if (!vol) return res.status(404).json({ error: 'No autorizado o no encontrado' });

    // Emitir evento de actualización en tiempo real (opcional)
    if (req.io) {
      req.io.emit('voluntariadoActualizado', vol);
    }

    res.json(vol);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Eliminar voluntariado
export async function eliminarVoluntariado(req, res) {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.session.user;
    const query = { _id: id };
    if (role !== 'admin') query.creadoPor = userId;
    const vol = await Voluntariado.findOneAndDelete(query);
    if (!vol) return res.status(404).json({ error: 'No autorizado o no encontrado' });

    // Emitir evento de eliminación en tiempo real
    if (req.io) {
      req.io.emit('voluntariadoEliminado', id);
    }

    res.json({ message: 'Eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
