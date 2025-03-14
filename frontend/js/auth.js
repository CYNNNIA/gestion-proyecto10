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
        let roleField = document.getElementById('authRole');

        // ✅ Asegurar que el campo de contraseña siempre esté en el formulario
        let passwordField = document.getElementById('authPassword');
        if (!passwordField) {
            passwordField = document.createElement('input');
            passwordField.type = "password";
            passwordField.id = "authPassword";
            passwordField.placeholder = "Contraseña";
            passwordField.required = true;
            authForm.appendChild(passwordField);
        }

        // ✅ Si estamos en modo registro y no existe el campo nombre, lo agregamos
        if (isRegistering && !nameField) {
            nameField = document.createElement('input');
            nameField.type = "text";
            nameField.id = "authName";
            nameField.placeholder = "Tu nombre";
            nameField.required = true;
            authForm.insertBefore(nameField, authForm.firstChild);
        } else if (!isRegistering && nameField) {
            nameField.remove();
        }

        // ✅ Si estamos en modo registro y no existe el campo de rol, lo agregamos
        if (isRegistering && !roleField) {
            roleField = document.createElement('select');
            roleField.id = "authRole";
            roleField.innerHTML = `
                <option value="cliente">Cliente</option>
                <option value="profesional">Profesional</option>
            `;
            authForm.insertBefore(roleField, authSubmitBtn);
        } else if (!isRegistering && roleField) {
            roleField.remove();
        }

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
        const roleField = document.getElementById('authRole');

        const name = nameField ? nameField.value.trim() : null;
        const role = roleField ? roleField.value : "cliente";

        if (!email || !password || (isRegistering && (!name || !role))) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        const endpoint = isRegistering ? 'http://127.0.0.1:5002/api/auth/register' : 'http://127.0.0.1:5002/api/auth/login';
        const bodyData = isRegistering ? { name, email, password, role } : { email, password };

        console.log("🛠 Enviando datos:", bodyData); // ✅ Verificar lo que se envía

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la autenticación');
            }

            console.log("✅ Respuesta del servidor:", data); // ✅ Verificar la respuesta

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.user?.name || "Usuario");
                localStorage.setItem('userEmail', data.user?.email || "No disponible");
                localStorage.setItem('userRole', data.user?.role || "cliente"); // 👈 Aquí aseguramos que el rol se guarde correctamente
            
                console.log("✅ Usuario guardado en localStorage:", {
                    name: data.user?.name,
                    email: data.user?.email,
                    role: data.user?.role
                });
            
                window.location.href = "profile.html";
            }
        } catch (error) {
            alert(`⚠️ ${error.message}`);
        }
    });
});