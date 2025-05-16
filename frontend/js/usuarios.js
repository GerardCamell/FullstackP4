import {
  obtenerUsuarios,
  registrarUsuario,
  eliminarUsuario as eliminarUsuarioAPI
} from './almacenaje.js';

const form = document.getElementById('formAltaUsuarios');
const tablaBody = document.getElementById('tablaUsuarios');

window.addEventListener('DOMContentLoaded', () => {
  // Comprobar sesión y rol
  const sessionUser = sessionStorage.getItem('usuarioActivo');
  if (!sessionUser) {
    window.location.href = 'login.html';
    return;
  }
  const { role } = JSON.parse(sessionUser);
  if (role !== 'admin') {
    alert('Acceso denegado: necesita ser administrador');
    window.location.href = 'login.html';
    return;
  }
  cargarYMostrarUsuarios();
});

// Función que obtiene y muestra usuarios
async function cargarYMostrarUsuarios() {
  try {
    const usuarios = await obtenerUsuarios();
    renderTabla(usuarios);
  } catch (err) {
    if (err.message.includes('No autenticado')) {
      window.location.href = 'login.html';
    } else {
      console.error(err);
      alert('Error al cargar usuarios');
    }
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

// Alta de usuario
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('nombre').value.trim();
  const email = document.getElementById('correo').value.trim();
  const password = document.getElementById('contraseña').value.trim();
  if (!name || !email || !password) {
    return alert('Todos los campos son obligatorios');
  }
  try {
    await registrarUsuario({ name, email, password });
    alert('¡Usuario registrado!');
    form.reset();
    cargarYMostrarUsuarios();
  } catch (err) {
    console.error(err);
    if (err.message.includes('No autenticado')) {
      window.location.href = 'login.html';
    } else {
      alert('Error al registrar usuario');
    }
  }
});

// Borrado de usuario
async function borrar(id) {
  if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
  try {
    await eliminarUsuarioAPI(id);
    cargarYMostrarUsuarios();
  } catch (err) {
    console.error(err);
    if (err.message.includes('No autenticado')) {
      window.location.href = 'login.html';
    } else {
      alert('Error al eliminar usuario');
    }
  }
}
