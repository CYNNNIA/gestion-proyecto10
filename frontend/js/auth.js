document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 auth.js cargado correctamente");

    // Obtener elementos del DOM
    const authForm = document.getElementById("authForm");
    const authSubmitBtn = document.getElementById("authSubmitBtn");
    const authTitle = document.getElementById("authTitle");
    const authToggleText = document.getElementById("authToggleText");

    if (!authForm || !authSubmitBtn) {
        console.error("❌ Error: No se encontraron elementos en el DOM. Revisa los IDs en el HTML.");
        return;
    }

    // Verificar si estamos en login.html o register.html
    const isRegisterPage = window.location.pathname.includes("register.html");

    if (isRegisterPage) {
        authTitle.textContent = "Registrarse";
        authSubmitBtn.textContent = "Registrarse";
    } else {
        authTitle.textContent = "Iniciar Sesión";
        authSubmitBtn.textContent = "Ingresar";
    }

    // Manejo del formulario de autenticación
    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("authName")?.value.trim();
        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value.trim();
        const role = document.getElementById("authRole")?.value;

        if (!email || !password || (isRegisterPage && (!name || !role))) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        const endpoint = isRegisterPage ? "/auth/register" : "/auth/login";
        const requestBody = isRegisterPage
            ? { name, email, password, role }
            : { email, password };

        try {
            const response = await fetch(`http://127.0.0.1:5002/api${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error en la solicitud.");

            // Guardar datos en LocalStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userRole", data.user.role);

            // Redirigir según el rol
            if (data.user.role === "profesional") {
                window.location.href = "dashboard-profesional.html";
            } else {
                window.location.href = "cliente.html"; // ✅
            }

        } catch (error) {
            console.error("❌ Error en autenticación:", error);
            alert(error.message);
        }
    });
});