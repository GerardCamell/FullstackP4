import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/usuario.js';

const router = express.Router();

// Ruta para registrar un usuario
router.post('/registro', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', loginUsuario);

export default router;