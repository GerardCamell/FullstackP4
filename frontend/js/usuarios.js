/* ----PESTAÑA USUARIOS--- */

//Llamamos a la funcion para ver los mostrar en la tabla los usuarios registrados

actualizarTabla();


document.getElementById('formAltaUsuarios').addEventListener('submit', function (event) {
    event.preventDefault();  

    //Declaramos las constantes donde se guardaran los valores que se indiquen en el formulario
    
    const nombreAltaUsuario = document.getElementById('nombre').value.trim();
    const emailAltaUsuario = document.getElementById('correo').value.trim();
    const passwordAltaUsuario = document.getElementById('contraseña').value.trim();

    //Mostramos un mensaje de error en caso que no se llenen las casillas
    //Mensaje de ecito si se llenan todas

    if (!nombreAltaUsuario || !emailAltaUsuario || !passwordAltaUsuario) {
        alert("Todos los campos son obligatorios");
        return;  
    } else {
        alert("¡Usuario registrado!")
    }

    //Almacenamos los datos

    const nuevoUsuarioRegistrado = {
        name: nombreAltaUsuario,
        email: emailAltaUsuario,
        password: passwordAltaUsuario
    };

    //Almacenamos el nuevo usuario en la array
    
    usuario.push(nuevoUsuarioRegistrado);

    document.getElementById('formAltaUsuarios').reset();

    

 // Llamamos a la función para actualizar la tabla
 actualizarTabla();
});

/*--MOSTRAR EN LA TABLA--*/
// Función para actualizar la tabla
function actualizarTabla() {
    const tablaUsuarios = document.getElementById('tablaUsuarios'); // Accedemos al tbody de la tabla

    // Limpiamos el contenido actual de la tabla
    tablaUsuarios.innerHTML = '';

    // Iteramos sobre los usuarios registrados y los añadimos a la tabla
    usuario.forEach((usuario, index) => {
        const nuevaFila = document.createElement('tr'); 

        // Añadimos celdas con la información del usuario
        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = usuario.name; 
        nuevaFila.appendChild(celdaNombre);

        const celdaEmail = document.createElement('td');
        celdaEmail.textContent = usuario.email; 
        nuevaFila.appendChild(celdaEmail);

        const celdaPassword = document.createElement('td');
        celdaPassword.textContent = usuario.password; 
        nuevaFila.appendChild(celdaPassword);

        // Crear celda de acciones con un botón de eliminar
        const celdaAcciones = document.createElement('td');
        celdaAcciones.innerHTML = `<button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${index})">Eliminar</button>`;
        nuevaFila.appendChild(celdaAcciones);

        // Añadimos la fila a la tabla
        tablaUsuarios.appendChild(nuevaFila);
    });
}

// Función para eliminar un usuario
function eliminarUsuario(index) {
    // Eliminar el usuario de la array
    usuario.splice(index, 1);

    // Actualizamos la tabla después de eliminar el usuario
    actualizarTabla();
}

