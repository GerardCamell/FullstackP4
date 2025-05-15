document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("usuarioActivo");
    if (!usuarioGuardado) {
        alert("Debes iniciar sesión");
        window.location.href = "login.html";
        return;
    }

    try {
        const usuarioLogueado = JSON.parse(usuarioGuardado);
        document.getElementById("nombreUser").textContent = usuarioLogueado.name;
        document.getElementById("emailUser").textContent = usuarioLogueado.email;
        document.getElementById("usuarioActivo").textContent = usuarioLogueado.name.toUpperCase();
    } catch (error) {
        console.error("Error al parsear el usuario activo:", error);
        alert("Error al cargar usuario, inicia sesión de nuevo.");
        localStorage.removeItem("usuarioActivo");
        window.location.href = "login.html";
    }
});

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "../html/login.html"; 
}
