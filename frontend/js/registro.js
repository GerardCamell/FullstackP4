import { registrarUsuario } from './almacenaje.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formRegistro');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name     = form.name.value.trim();
    const email    = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      // Llamada GraphQL al backend
      await registrarUsuario({ name, email, password, role: 'user' });
      alert('Usuario registrado exitosamente. Ya puedes iniciar sesión.');
      window.location.href = 'login.html';
    } catch (err) {
      alert('Error al registrar:\n' + err.message);
    }
  });
});