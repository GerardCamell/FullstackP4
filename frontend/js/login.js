import { login } from './almacenaje.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');
  const btnRegistro = document.getElementById('signOn');

  
  btnRegistro.addEventListener('click', () => {
    window.location.href = 'registro.html';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      
      const user = await login(email, password);
      
      sessionStorage.setItem('usuarioActivo', JSON.stringify(user));
      
      window.location.href = 'perfilusuario.html';
    } catch (err) {
      alert('Error al iniciar sesión:\n' + err.message);
    }
  });
});
