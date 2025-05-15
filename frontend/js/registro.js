import { registrarUsuario } from './almacenaje.js';

const form = document.querySelector('#form-registro');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = form.nombre.value;
  const email = form.email.value;
  const password = form.password.value;

  try {
    await registrarUsuario({ name, email, password, role: 'user' });
    alert('Usuario registrado ✅. Ahora haz login.');
    window.location.href = 'login.html';
  } catch (err) {
    alert('Error al registrar: ' + err.message);
  }
});