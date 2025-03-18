const API_URL = "http://127.0.0.1:5002/api/auth"; // ✅ URL base del backend

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authToggleText = document.getElementById('authToggleText');
    const errorMessage = document.getElementById('errorMessage');

    let isRegistering = false;

    function updateAuthUI() {
        authTitle.innerText = isRegistering ? "Registro" : "Iniciar Sesión";
        authSubmitBtn.innerText = isRegistering ? "Registrarse" : "Ingresar";

        authToggleText.innerHTML = isRegistering
            ? '¿Ya tienes cuenta? <a href="#" id="toggleAuth">Inicia sesión aquí</a>'
            : '¿No tienes cuenta? <a href="#" id="toggleAuth">Regístrate aquí</a>';

        document.getElementById('nameField').style.display = isRegistering ? "block" : "none";
        document.getElementById('roleField').style.display = isRegistering ? "block" : "none";

        document.getElementById('toggleAuth').addEventListener('click', (e) => {
            e.preventDefault();
            isRegistering = !isRegistering;
            updateAuthUI();
        });
    }

    updateAuthUI();

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = "none"; // Ocultar errores previos

        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value.trim();
        const nameField = document.getElementById('authName');
        const roleField = document.getElementById('authRole');

        const name = nameField ? nameField.value.trim() : null;
        const role = roleField ? roleField.value : "cliente"; 

        const endpoint = isRegistering ? `${API_URL}/register` : `${API_URL}/login`;
        const bodyData = isRegistering ? { name, email, password, role } : { email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();
            console.log("🔹 Respuesta del servidor:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Error en la autenticación');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.user?.name || "Usuario");
                localStorage.setItem('userEmail', data.user?.email || "No disponible");
                localStorage.setItem('userRole', data.user?.role || "cliente");

                console.log("✅ Usuario guardado en localStorage:", {
                    name: data.user?.name,
                    email: data.user?.email,
                    role: data.user?.role
                });

                window.location.href = "profile.html"; 
            }
        } catch (error) {
            errorMessage.innerText = `⚠️ ${error.message}`;
            errorMessage.style.display = "block";
        }
    });
});