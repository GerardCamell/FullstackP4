import Usuario from '../models/usuario.js';
import Voluntariado from '../models/voluntariado.js';

const root = {
  usuarios: async (args, context) => {
    if (!context.user || context.user.role !== 'admin') throw new Error('No autorizado');
    return Usuario.find({}, '-password');
  },

  voluntariados: async (args, context) => {
    if (!context.user) throw new Error('No autenticado');
    const filtro = context.user.role === 'admin' ? {} : { creadoPor: context.user.id };
    return Voluntariado.find(filtro).populate('creadoPor');
  },

  crearVoluntariado: async ({ titulo, descripcion, fecha, tipo }, context) => {
    if (!context.user) throw new Error('No autenticado');
    const nuevo = new Voluntariado({
      titulo,
      descripcion,
      fecha,
      tipo,
      creadoPor: context.user.id
    });
    return nuevo.save();
  },

  crearUsuario: async ({ name, email, password, role }, context) => {
    if (role === 'admin' && (!context.user || context.user.role !== 'admin')) {
      throw new Error('Solo admin puede crear usuarios admin');
    }
    const existente = await Usuario.findOne({ email });
    if (existente) throw new Error('Email ya registrado');
    const nuevo = new Usuario({ name, email, password, role });
    return nuevo.save();
  }
};

export default root;
