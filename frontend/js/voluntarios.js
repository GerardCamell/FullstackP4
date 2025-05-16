document.addEventListener('DOMContentLoaded', () => {
  cargarVoluntarios();
  document
    .getElementById('formAltaVoluntarios')
    .addEventListener('submit', handleAltaVoluntario);
});

async function cargarVoluntarios() {
  try {
    const res = await fetch('http://localhost:4000/voluntariados', {
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const lista = await res.json();
    pintarTabla(lista);
    actualizarGrafico(lista);
  } catch (err) {
    console.error('No se pudo cargar voluntarios:', err);
    alert('No se han podido recuperar los voluntarios.');
  }
}

function pintarTabla(lista) {
  const tbody = document.querySelector('#tablaVoluntarios tbody');
  tbody.innerHTML = ''; // limpio contenido previo

  lista.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.titulo}</td>
      <td>${v.creadoPor.name}</td>
      <td>${new Date(v.fecha).toLocaleDateString()}</td>
      <td>${v.descripcion}</td>
      <td>${v.tipo}</td>
      <td>
        <button data-id="${v.id}" class="btn-eliminar">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Enlazo manejadores de eliminación
  document.querySelectorAll('.btn-eliminar')
    .forEach(btn => btn.addEventListener('click', handleEliminar));
}

async function handleAltaVoluntario(event) {
  event.preventDefault();

  const data = {
    titulo:      document.getElementById('titulo').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim(),
    fecha:       document.getElementById('fecha').value,
    tipo:        document.getElementById('tipo').value.trim()
  };

  // Validación básica
  if (Object.values(data).some(v => !v)) {
    return alert('Todos los campos son obligatorios');
  }

  try {
    const res = await fetch('http://localhost:4000/voluntariados', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || res.status);
    }
    // Recargo la lista tras creación
    await cargarVoluntarios();
    event.target.reset();
  } catch (err) {
    console.error('Error al crear voluntariado:', err);
    alert('No se pudo crear el voluntariado.');
  }
}

async function handleEliminar(e) {
  const id = e.currentTarget.dataset.id;
  if (!confirm('¿Seguro que quieres eliminar este voluntariado?')) return;

  try {
    const res = await fetch(`http://localhost:4000/voluntariados/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || res.status);
    }
    // Recargo la lista tras eliminación
    await cargarVoluntarios();
  } catch (err) {
    console.error('Error al eliminar:', err);
    alert('No se pudo eliminar el voluntariado.');
  }
}

function actualizarGrafico(lista) {
  const canvas = document.getElementById('graficoVoluntarios');
  if (!canvas) {
    console.warn('No se encontró el canvas #graficoVoluntarios');
    return;
  }
  const ctx = canvas.getContext('2d');

  const tipos  = [...new Set(lista.map(v => v.tipo))];
  const counts = tipos.map(t => lista.filter(v => v.tipo === t).length);

  // Solo destruyo si ya hay un chart válido con método destroy
  if (
    window.graficoVoluntarios &&
    typeof window.graficoVoluntarios.destroy === 'function'
  ) {
    window.graficoVoluntarios.destroy();
  }

  // Creo uno nuevo y lo guardo
  window.graficoVoluntarios = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: tipos,
      datasets: [{
        label: 'Voluntariados por tipo',
        data: counts
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}