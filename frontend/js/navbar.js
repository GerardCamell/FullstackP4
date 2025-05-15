document.addEventListener('DOMContentLoaded', () => {
  const navAuth = document.getElementById('navAuth');
  navAuth.innerHTML = '';  

  const stored = sessionStorage.getItem('usuarioActivo');
  if (stored) {
    
    const user = JSON.parse(stored);
    navAuth.innerHTML = `
      <a class="nav-link text-white mx-2" href="perfilusuario.html">
        ${user.name}
      </a>
      <a class="nav-link text-white mx-2" id="btnLogout" href="#">Cerrar Sesión</a>
    `;
    document.getElementById('btnLogout').addEventListener('click', () => {
      
      import('./almacenaje.js').then(({ logout }) => {
        logout().catch(()=>{}).finally(() => {
          sessionStorage.removeItem('usuarioActivo');
          window.location.href = 'login.html';
        });
      });
    });
  } else {
    
    navAuth.innerHTML = `
      <a class="nav-link text-white mx-2" href="login.html">Iniciar Sesión</a>
      <a class="nav-link text-white mx-2" href="registro.html">Registrarse</a>
    `;
  }
});