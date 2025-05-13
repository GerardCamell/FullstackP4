// backend/routes/usuarios.js
import { Router } from 'express';
import * as usuariosController from '../controllers/usuarioController.js';
import { requireAuth, requireRole } from '../utils/authMiddleware.js';

const router = Router();

router.use(requireAuth);

// Listar todos los usuarios (solo admin)
router.get('/', requireRole('admin'), usuariosController.listarUsuarios);

// Obtener datos de un usuario (admin o el propio usuario)
router.get('/:id', usuariosController.obtenerUsuario);

// Actualizar usuario (admin o el propio usuario)
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar usuario (solo admin)
router.delete('/:id', requireRole('admin'), usuariosController.eliminarUsuario);

export default router;