function mostrarServicios(filtroTipoServicio = '', filtroUsuarioServicio = '') {
    const contenedorServicio = document.getElementById('contenedorServicios');
    contenedorServicio.innerHTML = '';

    const serviciosFiltrados = voluntario.filter(v =>
        (filtroTipoServicio === '' || v.tipo === filtroTipoServicio) &&
        (filtroUsuarioServicio === '' || v.usuario === filtroUsuarioServicio)
    );

    serviciosFiltrados.forEach(v => {
        const tarjetaServicios = document.createElement('div');
        tarjetaServicios.classList.add('tarjeta', v.tipo.toLowerCase().replace(/ /g, '_'));

        if (v.tipo.toLowerCase().includes('oferta')) {
            tarjetaServicios.classList.add('tipo-oferta');
        } else if (v.tipo.toLowerCase().includes('petición')) {
            tarjetaServicios.classList.add('tipo-peticion');
        }

        tarjetaServicios.innerHTML = `
            <h3>${v.titulo}</h3>
            <p><strong>Usuario:</strong> ${v.usuario}</p>
            <p><strong>Fecha:</strong> ${v.fecha}</p>
            <p><strong>Descripción:</strong> ${v.descripcion}</p>
            <p><strong>Tipo:</strong> ${v.tipo}</p>
        `;

        contenedorServicio.appendChild(tarjetaServicios);
    });
}

function filtrar(tipo = '', usuario = '') {
    mostrarServicios(tipo, usuario);
}

function filtrarMisServicios() {
    if (!usuarioLogueado) {
        alert("¡Por favor, inicia sesión para ver tus servicios!");
    } else {
        mostrarServicios('', usuarioLogueado.name);
    }
}

function filtrarServiciosDeOtros() {
    if (usuarioLogueado) {
        mostrarServicios('', '');
        const contenedorServicio = document.getElementById('contenedorServicios');
        const tarjetas = contenedorServicio.querySelectorAll('.tarjeta');

        tarjetas.forEach(tarjeta => {
            const usuario = tarjeta.querySelector('p').textContent.split(":")[1].trim();
            if (usuario === usuarioLogueado.name) {
                tarjeta.remove();
            }
        });
    } else {
        alert("¡Por favor, inicia sesión para ver los servicios de otros usuarios!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarServicios();
});