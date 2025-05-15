const API_URL = 'http://localhost:4000/api';

// Usuarios
export async function obtenerUsuarios() {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/usuarios`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Error al obtener usuarios');
  return await res.json();
}


export async function altaUsuario(usuario) {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });

  if (!res.ok) throw new Error('Error al registrar el usuario');
  return await res.json();
}

export async function eliminarUsuario(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Error al eliminar el usuario');
  return await res.json();
}

// Login
export async function loguearUsuario(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) return null;
  const data = await res.json();

  // Importante, guardar token en localStorage
  localStorage.setItem('token', data.token);

  return data;
}

export async function guardarUsuarioActivo(email) {
  const res = await fetch(`${API_URL}/usuarioActivo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (!res.ok) console.error('No se pudo guardar usuario activo');
}

export async function obtenerUsuarioActivo() {
  const res = await fetch(`${API_URL}/usuarioActivo`);
  if (!res.ok) return null;
  const data = await res.json();
  return data?.email || null;
}

// Voluntarios
export async function obtenerVoluntariados() {
  const res = await fetch(`${API_URL}/voluntariados`);
  return await res.json();
}

export async function guardarVoluntariado(voluntariado) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/voluntariados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(voluntariado)
  });

  if (!res.ok) throw new Error('Error al guardar voluntariado');
  return await res.json();
}


export async function eliminarVoluntariado(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/voluntariados/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Error al eliminar voluntariado');
}
