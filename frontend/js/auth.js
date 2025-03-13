document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authToggleText = document.getElementById('authToggleText');

    let isRegistering = false;

    function updateAuthUI() {
        authTitle.innerText = isRegistering ? "Registro" : "Iniciar sesión";
        authSubmitBtn.innerText = isRegistering ? "Registrarse" : "Ingresar";

        authToggleText.innerHTML = isRegistering
            ? '¿Ya tienes cuenta? <a href="#" id="toggleAuth">Inicia sesión aquí</a>'
            : '¿No tienes cuenta? <a href="#" id="toggleAuth">Regístrate aquí</a>';

        let nameField = document.getElementById('authName');

        // 📌 Si estamos en modo registro y el campo no existe, lo agregamos
        if (isRegistering && !nameField) {
            nameField = document.createElement('input');
            nameField.type = "text";
            nameField.id = "authName";
            nameField.placeholder = "Tu nombre";
            nameField.required = true;
            authForm.insertBefore(nameField, authForm.firstChild);
        } 
        // 📌 Si estamos en modo login y el campo existe, lo eliminamos
        else if (!isRegistering && nameField) {
            nameField.remove();
        }

        // Añadir evento de cambio de vista
        document.getElementById('toggleAuth').addEventListener('click', (e) => {
            e.preventDefault();
            isRegistering = !isRegistering;
            updateAuthUI();
        });
    }

    updateAuthUI();

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value.trim();
        const nameField = document.getElementById('authName');
        const name = nameField ? nameField.value.trim() : null;

        if (!email || !password || (isRegistering && !name)) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        const endpoint = isRegistering 
            ? 'http://127.0.0.1:5002/api/auth/register' 
            : 'http://127.0.0.1:5002/api/auth/login';

        const bodyData = isRegistering 
            ? { name, email, password } 
            : { email, password };

        try {
            console.log("📩 Enviando datos:", bodyData); // Depuración

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();
            console.log("📩 Respuesta del servidor:", data); // Depuración

            if (!response.ok) {
                throw new Error(data.message || 'Error en la autenticación');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.user?.name || "Usuario");

                // Redirigir al perfil
                window.location.href = "profile.html";
            }
        } catch (error) {
            alert(`⚠️ ${error.message}`);
            console.error("❌ Error en la autenticación:", error);
        }
    });
});