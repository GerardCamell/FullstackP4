import { Router } from 'express';
import * as ctrl from '../controllers/voluntariadoController.js';
import { requireAuth } from '../utils/authMiddleware.js'; // crea este helper
const router = Router();

router.use(requireAuth);

router
  .route('/')
  .get(ctrl.listarVoluntariados)
  .post(ctrl.crearVoluntariado);

router
  .route('/:id')
  .get(ctrl.obtenerVoluntariado)
  .put(ctrl.actualizarVoluntariado)
  .delete(ctrl.eliminarVoluntariado);

export default router;