/*--  PESTAÑA VOLUNTARIADOS  --*/

// Queremos ver en una tabla los voluntarios en la tabla
actualizarTabla2();

document.getElementById('formAltaVoluntarios').addEventListener('submit', function (event) {
    event.preventDefault();  
    
    // Guardamos los valores que se indiquen en el formulario en las siguientes constantes:
    const tituloVoluntario = document.getElementById('titulo').value.trim();
    const nombreUsuario = document.getElementById('usuario').value.trim();
    const fechaEvento = document.getElementById('fecha').value.trim();
    const descripcionVoluntario = document.getElementById('descripcion').value.trim();
    const tipoAyuda = document.getElementById('tipo').value.trim();

    // Queremos que todos los campos estén completos
    if (!tituloVoluntario || !nombreUsuario || !fechaEvento || !descripcionVoluntario || !tipoAyuda) {
        alert("Todos los campos son obligatorios");
        return;  
    }

    // Encontramos el usuario que coincida con el nombre de usuario.
    const usuarioRegistrado = usuario.find(usuario => usuario.name === nombreUsuario); // cambios: "usuariosRegistrados" por la variable "let usuarios"
    
    // Si el usuario NO está en la variable "usuario"
    if (!usuarioRegistrado) {
        alert("¡Vaya, el usuario no está registrado!. Introduzca un usuario válido o regístrate.");
        return;
    }
    
    // Por defecto la fecha es 2025-3-17, hay que modificarla a 17/03/2025
    const newDate = fechaEvento.split("-").reverse().join("/");

    // Creamos el nuevo voluntario con los datos del formulario
    const nuevoVoluntarioRegistrado = {
        titulo: tituloVoluntario,
        usuario: usuarioRegistrado.name,  // Vinculamos el voluntario con el nombre del usuario registrado
        fecha: newDate, // para que la fecha esté ordenada
        descripcion: descripcionVoluntario,
        tipo: tipoAyuda,
    };

    // Almacenamos el nuevo voluntario en el array de voluntarios
    voluntario.push(nuevoVoluntarioRegistrado);

    // Restablecemos el formulario
    document.getElementById('formAltaVoluntarios').reset();

    // Llamamos a la función para actualizar la tabla
    actualizarTabla2();
});

/*-- MOSTRAR EN LA TABLA --*/
// Función para actualizar la tabla de voluntarios
function actualizarTabla2() {
    const tablaVoluntarios = document.getElementById('tablaVoluntarios'); // Accedemos al tbody de la tabla

    // Limpiamos el contenido actual de la tabla
    tablaVoluntarios.innerHTML = '';

    // Iteramos sobre los voluntarios registrados y los añadimos a la tabla
    voluntario.forEach((voluntario, index) => {
        const nuevaFila2 = document.createElement('tr'); 

        // Añadimos celdas con la información del voluntario
        const celdaTitulo = document.createElement('td');
        celdaTitulo.textContent = voluntario.titulo; 
        nuevaFila2.appendChild(celdaTitulo);

        const celdaUsuario = document.createElement('td');
        celdaUsuario.textContent = voluntario.usuario; 
        nuevaFila2.appendChild(celdaUsuario);

        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = voluntario.fecha; 
        nuevaFila2.appendChild(celdaFecha);

        const celdaDescripcion = document.createElement('td');
        celdaDescripcion.textContent = voluntario.descripcion; 
        nuevaFila2.appendChild(celdaDescripcion);

        const celdaTipo = document.createElement('td');
        celdaTipo.textContent = voluntario.tipo; 
        nuevaFila2.appendChild(celdaTipo);

        // Crear celda de acciones con un botón de eliminar
        const celdaAcciones2 = document.createElement('td');
        celdaAcciones2.innerHTML = `<button class="btn btn-danger btn-sm" onclick="eliminarVoluntario(${index})">Eliminar</button>`;
        nuevaFila2.appendChild(celdaAcciones2);

        // Añadimos la fila a la tabla
        tablaVoluntarios.appendChild(nuevaFila2);
    });

    // Actualizar el gráfico después de modificar la tabla
    actualizarGrafico();
}

// Función para eliminar un voluntario
function eliminarVoluntario(index) {
    // Eliminar el voluntario del array
    voluntario.splice(index, 1);

    // Actualizamos la tabla y el gráfico después de eliminar
    actualizarTabla2();
}
