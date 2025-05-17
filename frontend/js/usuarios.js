import {
  obtenerUsuarios,
  registrarUsuario,
  eliminarUsuario as eliminarUsuarioAPI
} from './almacenaje.js';

const form = document.getElementById('formAltaUsuarios');
const tablaBody = document.getElementById('tablaUsuarios');

window.addEventListener('DOMContentLoaded', async () => {
  // 1) Recuperar la sesión
  const sessionData = sessionStorage.getItem('usuarioActivo') || localStorage.getItem('usuarioActivo');
  if (!sessionData) {
    // Si no hay sesión activa, redirigir a login
    return window.location.href = 'login.html';
  }

  let user;
  try {
    user = JSON.parse(sessionData);
  } catch (e) {
    // Si falla el parseo, forzar login
    return window.location.href = 'login.html';
  }
console.log('ROL LEÍDO DEL USUARIO:', user.role);
  // 2) Control de acceso: solo redirigir si NO hay sesión.
  //    Usuarios logueados de cualquier rol pueden ver el formulario.
  //    Solo admins ven el selector y la tabla.
  if (user.role !== 'admin') {
    // Ocultar la sección de consulta/borrado si no es admin
    const tableColumn = tablaBody.closest('.col');
    if (tableColumn) tableColumn.style.display = 'none';
  } else {
    // Si es admin, mostrar selector de rol y cargar tabla
    const roleContainer = document.getElementById('role-container');
    if (roleContainer) roleContainer.style.display = 'block';
    await cargarYMostrarUsuarios();
  }
});

// Función que obtiene y muestra usuarios (solo para admin)
async function cargarYMostrarUsuarios() {
  try {
    const usuarios = await obtenerUsuarios();
    renderTabla(usuarios);
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    // Si el servidor exige autenticación, simplemente ocultar la tabla
    const tableColumn = tablaBody.closest('.col');
    if (tableColumn) tableColumn.style.display = 'none';
  }
}

// Renderizar la tabla con los datos remotos
function renderTabla(usuarios) {
  tablaBody.innerHTML = '';
  usuarios.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>
        <button class="btn btn-danger btn-sm">Eliminar</button>
      </td>
    `;
    tr.querySelector('button').addEventListener('click', () => borrar(u.id));
    tablaBody.appendChild(tr);
  });
}

// Alta de usuario (accesible para todos los logueados)
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name  = document.getElementById('nombre').value.trim();
  const email = document.getElementById('correo').value.trim();
  const pass  = document.getElementById('contraseña').value.trim();
  // Para admins, leer el rol del selector; para otros, será 'user'
  const roleContainer = document.getElementById('role-container');
  const roleSelect    = document.getElementById('role');
  const role = (roleContainer && roleContainer.style.display === 'block')
                ? roleSelect.value
                : 'user';

  if (!name || !email || !pass) {
    return alert('Todos los campos son obligatorios');
  }

  try {
    await registrarUsuario({ name, email, password: pass, role });
    alert('¡Usuario registrado!');
    form.reset();
    // Si es admin, recargar tabla
    const roleContainer = document.getElementById('role-container');
    if (roleContainer && roleContainer.style.display === 'block') {
      await cargarYMostrarUsuarios();
    }
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    alert('No se pudo registrar el usuario');
  }
});

// Borrar usuario (solo para admin)
async function borrar(id) {
  if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
  try {
    await eliminarUsuarioAPI(id);
    await cargarYMostrarUsuarios();
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    alert('No se pudo eliminar el usuario');
  }
}
