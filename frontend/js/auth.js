document.addEventListener('DOMContentLoaded', () => {
    const authTitle = document.getElementById('authTitle');
    const authForm = document.getElementById('authForm');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authToggleText = document.getElementById('authToggleText');
    const authView = document.getElementById('authView');
    const profileView = document.getElementById('profileView');
    const logoutBtn = document.getElementById('logoutBtn');

    let isRegistering = false;

    function updateAuthUI() {
        authTitle.innerText = isRegistering ? "Registro" : "Iniciar sesión";
        authSubmitBtn.innerText = isRegistering ? "Registrarse" : "Ingresar";

        authToggleText.innerHTML = isRegistering
            ? '¿Ya tienes cuenta? <a href="#" id="toggleAuth">Inicia sesión aquí</a>'
            : '¿No tienes cuenta? <a href="#" id="toggleAuth">Regístrate aquí</a>';

        let nameField = document.getElementById('authName');
        if (isRegistering && !nameField) {
            const newInput = document.createElement('input');
            newInput.type = "text";
            newInput.id = "authName";
            newInput.placeholder = "Tu nombre";
            newInput.required = true;
            authForm.insertBefore(newInput, authForm.firstChild);
        } else if (!isRegistering && nameField) {
            nameField.remove();
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
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const nameField = document.getElementById('authName');
        const name = nameField ? nameField.value : null;

        const endpoint = isRegistering ? 'http://127.0.0.1:5002/api/auth/register' : 'http://127.0.0.1:5002/api/auth/login';
        const bodyData = isRegistering ? { name, email, password } : { email, password };

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

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.user.name);
                
                authView.style.display = 'none';
                profileView.style.display = 'block';
                document.getElementById('username').innerText = data.user.name;
                logoutBtn.style.display = 'block';
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Cierre de sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.reload();
    });

    // Comprobación de sesión activa
    const token = localStorage.getItem('token');
    if (token) {
        authView.style.display = 'none';
        profileView.style.display = 'block';
        document.getElementById('username').innerText = localStorage.getItem('userName');
        logoutBtn.style.display = 'block';
    }
});