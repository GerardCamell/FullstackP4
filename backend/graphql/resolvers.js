import Usuario from '../models/usuario.js';
import Voluntariado from '../models/voluntariado.js';

const root = {
  usuarios: async () => await Usuario.find({}, '-password'),
  voluntariados: async () => await Voluntariado.find().populate('creadoPor'),
  crearVoluntariado: async ({ titulo, descripcion, fecha, tipo }, context) => {
    const nuevo = new Voluntariado({
      titulo,
      descripcion,
      fecha,
      tipo,
      creadoPor: context.req.session.user.id
    });
    return await nuevo.save();
  },
  crearUsuario: async ({ name, email, password, role }) => {
    const nuevo = new Usuario({ name, email, password, role });
    return await nuevo.save();
  }
};

export default root;
