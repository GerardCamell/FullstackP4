// backend/routes/usuarios.js
import { Router } from 'express';
import * as usuariosController from '../controllers/usuarioController.js';
import { requireAuth, requireRole } from '../utils/authMiddleware.js';

const router = Router();

// Todas las rutas de usuario requieren sesión
router.use(requireAuth);

// Listar (solo admin)
router.get('/', requireRole('admin'), usuariosController.listarUsuarios);

// Fetch/update/delete de un usuario (admin o el propio)
router.get('/:id', usuariosController.obtenerUsuario);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/:id', requireRole('admin'), usuariosController.eliminarUsuario);

export default router;