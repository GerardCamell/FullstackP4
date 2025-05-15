document.addEventListener('DOMContentLoaded', () => {
  const enlace = document.getElementById('usuarioActivo');
  const stored = sessionStorage.getItem('usuarioActivo');
  if (stored) {
    const user = JSON.parse(stored);
    enlace.textContent = user.name;
    enlace.href = 'perfilusuario.html';
  } else {
    enlace.textContent = '-NO LOGIN-';
    enlace.href = 'login.html';
  }
});