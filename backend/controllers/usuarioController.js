import { Usuario } from '../models/usuario.js';

// Registro de usuario
export async function registrarUsuario(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // 1) Verificar si ya existe el email
    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // 2) Crear la instancia; el hook pre('save') del modelo hará el hash
    const nuevo = new Usuario({ name, email, password, role });
    await nuevo.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Login de usuario

export async function loginUsuario(req, res) {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    //Comparar la contraseña
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    //Guardar datos
    req.session.user = { id: user._id.toString(), role: user.role };
    res.json({
      id:    user._id,
      name:  user.name,
      email: user.email,
      role:  user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Logout
export function logoutUsuario(req, res) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid').json({ message: 'Logout exitoso' });
  });
}

//Listar todos (solo admin)
export async function listarUsuarios(req, res) {
  try {
    const lista = await Usuario.find({}, '-password');
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener usuario (admin o el propio usuario)
export async function obtenerUsuario(req, res) {
  try {
    const { id } = req.params;
    const sess = req.session.user;

    // Si no es admin y no coincide con su propio ID → 403
    if (sess.role !== 'admin' && sess.id !== id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const user = await Usuario.findById(id, '-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Actualizar (admin o propio usuario)
export async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const sess = req.session.user;

    // Permite solo admin o el mismo usuario
    if (sess.role !== 'admin' && sess.id !== id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Evita que usuarios normales cambien su role
    if (req.body.role && sess.role !== 'admin') {
      delete req.body.role;
    }

    // Evita que password se reescriba aquí (o gestiona aparte)
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await Usuario.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
        select: '-password'
      }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar (solo admin)
export async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;

    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const user = await Usuario.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

