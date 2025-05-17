import { PubSub } from 'graphql-subscriptions';
import Usuario from '../models/usuario.js';
import Voluntariado from '../models/voluntariado.js';
import Estado from '../models/estado.js';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    usuarios: async (_, __, { req }) => {
      if (!req.session.user) throw new Error('No autenticado');
      if (req.session.user.role !== 'admin') throw new Error('No autorizado');
      return Usuario.find({}, '-password');
    },
    usuario: async (_, { id }, { req }) => {
      if (!req.session.user) throw new Error('No autenticado');
      const { role, id: userId } = req.session.user;
      if (role !== 'admin' && userId !== id) throw new Error('No autorizado');
      return Usuario.findById(id, '-password');
    },
    voluntariados: async (_, __, { req }) => {
      if (!req.session.user) throw new Error('No autenticado');
      const { role, id: userId } = req.session.user;
      const filtro = role === 'admin' ? {} : { creadoPor: userId };
      return Voluntariado.find(filtro).populate('creadoPor', 'name email role');
    },
    voluntariado: async (_, { id }, { req }) => {
      if (!req.session.user) throw new Error('No autenticado');
      const { role, id: userId } = req.session.user;
      const query = { _id: id };
      if (role !== 'admin') query.creadoPor = userId;
      return Voluntariado.findOne(query).populate('creadoPor', 'name email role');
    },
    estados: async (_, __, { req }) => {
      if (!req.session.user) throw new Error('No autenticado');
      return Estado.find();
    }
  },

  Mutation: {
    registrarUsuario: async (_, { input }) => {
      const { email } = input;
      if (await Usuario.findOne({ email })) {
        throw new Error('El email ya está registrado');
      }
      const nuevo = new Usuario(input);
      return nuevo.save();
    },
    login: async (_, { email, password }, { req }) => {
      const user = await Usuario.findOne({ email });
      if (!user) throw new Error('Credenciales inválidas');
      const ok = await user.comparePassword(password);
      if (!ok) throw new Error('Credenciales inválidas');
      req.session.user = { id: user._id.toString(), role: user.role };
      return user;
    },
    crearVoluntariado: async (_, { input }, { req }) => {
      if (!req.session.user) throw new Error('No autenticado');
      const { id: userId } = req.session.user;
      const nuevo = new Voluntariado({
        ...input,
        fecha: input.fecha ? new Date(input.fecha) : undefined,
        creadoPor: userId
      });
      const vol = await nuevo.save();
      const populated = await vol.populate('creadoPor', 'name email role');
      pubsub.publish('VOLUN_CREADO', { voluntariadoCreado: populated });
      return populated;
    },
    actualizarUsuario: async (_, { id, input }, { req }) => {
      const sess = req.session.user;
      if (!sess) throw new Error('No autenticado');
      if (sess.role !== 'admin' && sess.id !== id) throw new Error('No autorizado');
      if (input.password) delete input.password; // gestionar aparte
      if (input.role && sess.role !== 'admin') delete input.role;
      return Usuario.findByIdAndUpdate(id, input, { new: true, runValidators: true, select: '-password' });
    },
    eliminarUsuario: async (_, { id }, { req }) => {
      const sess = req.session.user;
      if (!sess) throw new Error('No autenticado');
      if (sess.role !== 'admin') throw new Error('No autorizado');
      const res = await Usuario.findByIdAndDelete(id);
      return Boolean(res);
    },
    actualizarVoluntariado: async (_, { id, input }, { req }) => {
      const sess = req.session.user;
      if (!sess) throw new Error('No autenticado');
      const query = { _id: id };
      if (sess.role !== 'admin') query.creadoPor = sess.id;
      const updated = await Voluntariado.findOneAndUpdate(query, input, { new: true, runValidators: true })
        .populate('creadoPor', 'name email role');
      if (!updated) throw new Error('No autorizado o no encontrado');
      return updated;
    },
    eliminarVoluntariado: async (_, { id }, { req }) => {
      const sess = req.session.user;
      if (!sess) throw new Error('No autenticado');
      const query = { _id: id };
      if (sess.role !== 'admin') query.creadoPor = sess.id;
      const res = await Voluntariado.findOneAndDelete(query);
      return Boolean(res);
    },
    crearEstado: async (_, { input }, { req }) => {
      if (!req.session.user) throw new Error('No autenticado');
      const nuevo = new Estado(input);
      return nuevo.save();
    }
  },

  Subscription: {
    voluntariadoCreado: {
      subscribe: () => pubsub.asyncIterator('VOLUN_CREADO')
    }
  }
};