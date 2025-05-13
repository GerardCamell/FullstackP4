// backend/routes/auth.js
import { Router } from 'express';
import {
  registrarUsuario,
  loginUsuario,
  logoutUsuario
} from '../controllers/usuarioController.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = Router();

// Registro y login NO requieren sesión
router.post('/register', registrarUsuario);
router.post('/login',    loginUsuario);

// A partir de aquí, sí protegemos con sesión
router.use(requireAuth);

router.post('/logout', logoutUsuario);
router.get('/me',      (req, res) => {
  res.json(req.session.user);
});

export default router;