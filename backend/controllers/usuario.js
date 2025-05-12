
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