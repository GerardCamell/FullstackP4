const GRAPHQL_URL = 'http://localhost:4000/graphql';


async function graphQLRequest(query, variables = {}) {
  const resp = await fetch(GRAPHQL_URL, {
    method: 'POST',
    credentials: 'include',           
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  const { data, errors } = await resp.json();
  if (errors) {
    throw new Error(errors.map(e => e.message).join('\n'));
  }
  return data;
}

//Mutaciones de usuario

export async function registrarUsuario({ name, email, password, role = 'user' }) {
  const mutation = `
    mutation RegistrarUsuario($input: UsuarioInput!) {
      registrarUsuario(input: $input) {
        id
        name
        email
        role
      }
    }
  `;
  const variables = {
    input: { name, email, password, role }
  };
  const { registrarUsuario } = await graphQLRequest(mutation, variables);
  return registrarUsuario;
}

export async function login(email, password) {
  const mutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        name
        email
        role
      }
    }
  `;
  const variables = { email, password };
  const { login } = await graphQLRequest(mutation, variables);
  return login;
}

export async function logout() {
  const mutation = `mutation { logout }`;
  const { logout: ok } = await graphQLRequest(mutation);
  return ok;
}

// Queries 

export async function obtenerUsuarios() {
  const query = `
    query {
      usuarios {
        id
        name
        email
        role
      }
    }
  `;
  const { usuarios } = await graphQLRequest(query);
  return usuarios;
}

export async function obtenerVoluntariados() {
  const query = `
    query {
      voluntariados {
        id
        titulo
        descripcion
        tipo
        creadoPor { id name email }
        createdAt
      }
    }
  `;
  const { voluntariados } = await graphQLRequest(query);
  return voluntariados;
}

// Mutaciones de voluntariados 

export async function crearVoluntariado({ titulo, descripcion, tipo }) {
  const mutation = `
    mutation CrearVoluntariado($input: VoluntariadoInput!) {
      crearVoluntariado(input: $input) {
        id
        titulo
        descripcion
        tipo
        creadoPor { id name }
      }
    }
  `;
  const variables = { input: { titulo, descripcion, tipo } };
  const { crearVoluntariado } = await graphQLRequest(mutation, variables);
  return crearVoluntariado;
}

export async function actualizarVoluntariado(id, { titulo, descripcion, tipo }) {
  const mutation = `
    mutation ActualizarVoluntariado($id: ID!, $input: VoluntariadoInput!) {
      actualizarVoluntariado(id: $id, input: $input) {
        id
        titulo
        descripcion
        tipo
      }
    }
  `;
  const variables = { id, input: { titulo, descripcion, tipo } };
  const { actualizarVoluntariado } = await graphQLRequest(mutation, variables);
  return actualizarVoluntariado;
}

export async function eliminarVoluntariado(id) {
  const mutation = `
    mutation EliminarVoluntariado($id: ID!) {
      eliminarVoluntariado(id: $id)
    }
  `;
  const variables = { id };
  const { eliminarVoluntariado } = await graphQLRequest(mutation, variables);
  return eliminarVoluntariado; 
}

export async function eliminarUsuario(id) {
  const mutation = `
    mutation EliminarUsuario($id: ID!) {
      eliminarUsuario(id: $id)
    }
  `;
  const variables = { id };
  // Desestructuramos el booleano (o lo que retorne tu API)
  const { eliminarUsuario } = await graphQLRequest(mutation, variables);
  return eliminarUsuario;
}const API_URL = 'http://localhost:4000/api';

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
