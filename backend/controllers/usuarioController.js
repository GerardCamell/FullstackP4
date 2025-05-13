import { Usuario } from '../models/usuario.js';

// Registro de usuario
export async function registrarUsuario(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // 1) Verificar si ya existe
    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear instancia con password 
    const nuevo = new Usuario({ name, email, password, role });
    await nuevo.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function loginUsuario(req, res) {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Comparar contraseña
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Guardar sesión
    req.session.user = { id: user._id, role: user.role };
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Logout
export function logoutUsuario(req, res) {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.clearCookie('connect.sid').json({ message: 'Logout exitoso' });
  });
}
