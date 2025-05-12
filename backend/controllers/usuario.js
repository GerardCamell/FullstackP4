
import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.js';

export async function registrarUsuario(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({ name, email, password: hashedPassword, role });
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function loginUsuario(req, res) {
  try {
    const { email, password } = req.body;
    // Buscar el user por el emilio
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      throw new Error('El email o la contraseña son incorrectos');
    }
    //Comparamos la password de la database con la password que escribira el user.
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      throw new Error('La contraseña es incorrecta');
    }
     //Guardar el ID del usuario en la sesión correspondiente :P
    req.session.userId = usuario._id;

    res.status(200).json({name: usuario.name, email: usuario.email, role: usuario.role });
    }catch (error) {
    throw new Error('Error al iniciar sesión: ' + error.message);
  }
}

