import { Router } from 'express';
import { loginUsuario, logoutUsuario, registrarUsuario } from '../controllers/usuarioController.js';
const router = Router();
router.post('/register', registrarUsuario);
router.post('/login',    loginUsuario);
router.post('/logout',   logoutUsuario);
export default router;