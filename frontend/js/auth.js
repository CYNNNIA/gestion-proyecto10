document.addEventListener('DOMContentLoaded', () => {
    const authTitle = document.getElementById('authTitle');
    const authForm = document.getElementById('authForm');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authToggleText = document.getElementById('authToggleText');
    const authView = document.getElementById('authView');
    const profileView = document.getElementById('profileView');
  
    let isRegistering = false;
  
    function updateAuthUI() {
        authTitle.innerText = isRegistering ? "Registro" : "Iniciar sesión";
        authSubmitBtn.innerText = isRegistering ? "Registrarse" : "Ingresar";
  
        authToggleText.innerHTML = isRegistering
            ? '¿Ya tienes cuenta? <a href="#" id="toggleAuth">Inicia sesión aquí</a>'
            : '¿No tienes cuenta? <a href="#" id="toggleAuth">Regístrate aquí</a>';
  
        document.getElementById('toggleAuth').addEventListener('click', (e) => {
            e.preventDefault();
            isRegistering = !isRegistering;
            updateAuthUI();
        });
    }
  
    updateAuthUI();
  
    // ✅ **Manejo del Formulario**
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const name = document.getElementById('authName') ? document.getElementById('authName').value : null;
  
        const endpoint = isRegistering ? 'http://127.0.0.1:5002/api/auth/register' : 'http://127.0.0.1:5002/api/auth/login';
        const bodyData = isRegistering ? { name, email, password } : { email, password };
  
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });
  
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
  
            const data = await response.json();
  
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert(isRegistering ? "Registro exitoso. Ahora inicia sesión." : "Inicio de sesión exitoso.");
                
                // ✅ **Ocultar login y mostrar perfil**
                authView.style.display = 'none';
                profileView.style.display = 'block';
  
                window.location.reload();
            } else {
                alert(data.message || "Error en la autenticación");
            }
        } catch (error) {
            console.error("Error en la autenticación:", error);
            alert("Hubo un problema con la autenticación.");
        }
    });
  });