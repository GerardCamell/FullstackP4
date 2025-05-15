import { logout } from './almacenaje.js';

document.addEventListener('DOMContentLoaded', () => {
  const stored = sessionStorage.getItem('usuarioActivo');
  if (!stored) return window.location.href = 'login.html';
  const user = JSON.parse(stored);

  document.getElementById('nombreUser').textContent = user.name;
  document.getElementById('emailUser').textContent = user.email;

  
  window.cerrarSesion = async () => {
    try {
      await logout();
    } catch (e) {  }
    sessionStorage.removeItem('usuarioActivo');
    window.location.href = 'login.html';
  };
});