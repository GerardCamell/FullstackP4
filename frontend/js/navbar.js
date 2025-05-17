import { logout } from './almacenaje.js';

const navAuth = document.getElementById('navAuth');
if (!navAuth) {
  console.warn('No existe #navAuth en el DOM');
} else {
  const stored = sessionStorage.getItem('usuarioActivo');
  if (stored) {
    const user = JSON.parse(stored);
    navAuth.innerHTML = `
      <a class="nav-link text-white mx-2" href="perfilusuario.html">${user.name}</a>
      <a class="nav-link text-white mx-2" id="btnLogout" href="#">Cerrar Sesión</a>
    `;
    document.getElementById('btnLogout').addEventListener('click', async () => {
      await logout().catch(() => {});
      sessionStorage.removeItem('usuarioActivo');
      window.location.href = 'login.html';
    });
  } else {
    navAuth.innerHTML = `
      <a class="nav-link text-white mx-2" href="login.html">Iniciar Sesión</a>
      <a class="nav-link text-white mx-2" href="registro.html">Registrarse</a>
    `;
  }
}