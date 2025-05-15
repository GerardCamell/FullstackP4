// login.js
import { loguearUsuario, obtenerUsuarioActivo } from "./almacenaje.js";

function logInUser(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("¡Todos los campos deben ser completados!");
        return;
    }

    const usuario = loguearUsuario(email, password);
    if (usuario) {
        console.log("Usuario logueado:", usuario); // usuario guardado correctamente
        //usuario en localStorage
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        console.log("Usuario guardado en localStorage:", localStorage.getItem("usuarioActivo"));
            window.location.href = "perfilusuario.html";
       
    } else {
        alert("El email o la contraseña no son correctos");
    }
}
function userRegister(event){
    event.preventDefault(); 
    window.location.href = "usuarios.html";
}


function mostrarUsuarioActivo() {
    const usuarioActivo = obtenerUsuarioActivo();  // Obtener el usuariodesde localStorage
    const elementoUsuarioActivo = document.getElementById("usuarioActivo");  

    if (usuarioActivo) {
        elementoUsuarioActivo.textContent = usuarioActivo.name.toUpperCase(); 
    } else {
        elementoUsuarioActivo.textContent = "-NO LOGIN-";  // Si no hay usuario, mostrar "-NO LOGIN-"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo();  // Mostrar el usuario activo
    const loginForm = document.getElementById("formLogin");
    if (loginForm) {
        loginForm.addEventListener("submit", logInUser); //log User
    }
    const signOn = document.getElementById("signOn"); // Suponiendo que tu botón tiene este ID
    if (signOn) {
        signOn.addEventListener("click", userRegister); // Evento para ir a registro
    }
});
