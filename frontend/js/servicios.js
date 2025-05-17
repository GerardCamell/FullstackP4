import { obtenerVoluntariados } from './almacenaje.js';

let listaVoluntariados = [];
let usuarioLogueado = null;

async function mostrarServicios(filtroTipoServicio = '', filtroUsuarioServicio = '') {
    const contenedorServicio = document.getElementById('contenedorServicios');
    contenedorServicio.innerHTML = '';

    console.log("Tipos reales:", listaVoluntariados.map(v => v.tipo));

    const serviciosFiltrados = listaVoluntariados.filter(v =>
        (filtroTipoServicio === '' || v.tipo.toLowerCase() === filtroTipoServicio.toLowerCase()) &&
        (filtroUsuarioServicio === '' || v.creadoPor.name === filtroUsuarioServicio)
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
            <p><strong>Usuario:</strong> ${v.creadoPor.name}</p>
            <p><strong>Fecha:</strong> ${new Date(v.createdAt).toLocaleDateString()}</p>
            <p><strong>Descripción:</strong> ${v.descripcion}</p>
            <p><strong>Tipo:</strong> ${v.tipo}</p>
        `;

        contenedorServicio.appendChild(tarjetaServicios);
    });
}

function filtrar(tipo = '', usuario = '') {
    mostrarServicios(tipo.toLowerCase(), usuario);
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

document.addEventListener("DOMContentLoaded", async () => {
    try {
        listaVoluntariados = await obtenerVoluntariados();

        const userData = sessionStorage.getItem('user');
        if (userData) {
            usuarioLogueado = JSON.parse(userData);
        }

        mostrarServicios();

        //Enlazar botones correctamente
        document.getElementById('btnMostrarTodo').addEventListener('click', () => filtrar());
        document.getElementById('btnOferta').addEventListener('click', () => filtrar('Oferta'));
        document.getElementById('btnPeticion').addEventListener('click', () => filtrar('Petición'));
        document.getElementById('btnMisServicios').addEventListener('click', filtrarMisServicios);
        document.getElementById('btnServiciosOtros').addEventListener('click', filtrarServiciosDeOtros);

    } catch (err) {
        console.error('Error al cargar voluntariados:', err);
        alert('No se pudieron cargar los servicios.');
    }
});
