
import { Router } from 'express';
import * as ctrl from '../controllers/voluntariadoController.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Listar todos los voluntariados / Crear uno nuevo
router
  .route('/')
  .get(ctrl.listarVoluntariados)
  .post(ctrl.crearVoluntariado);

// Obtener, actualizar o borrar un voluntariado por ID
router
  .route('/:id')
  .get(ctrl.obtenerVoluntariado)
  .put(ctrl.actualizarVoluntariado)
  .delete(ctrl.eliminarVoluntariado);

export default router;