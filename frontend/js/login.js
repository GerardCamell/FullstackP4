import { login } from './almacenaje.js';

const form = document.getElementById('formLogin');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    // 1) Llamas a tu mutación de login
    const user = await login(email, password);

    // 2) Guardas el objeto usuario en sessionStorage
    sessionStorage.setItem('usuarioActivo', JSON.stringify(user));

    // 3) Rediriges a la página protegida
    window.location.href = 'usuarios.html';
  } catch (err) {
    console.error('Login fallido:', err);
    alert('Credenciales inválidas o no autenticado');
  }
});