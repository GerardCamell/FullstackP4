// backend/routes/auth.js
import { Router } from 'express';
import {
  registrarUsuario,
  loginUsuario,
  logoutUsuario
} from '../controllers/usuarioController.js';

import { requireAuth } from '../utils/authMiddleware.js';

const router = Router();

router.post('/register', registrarUsuario);
router.post('/login',    loginUsuario);

router.use(requireAuth);
router.post('/logout', logoutUsuario);

router.get('/me', (req, res) => {
  res.json(req.user); //
});

export default router;
