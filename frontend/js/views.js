document.addEventListener('DOMContentLoaded', () => {
    const views = document.querySelectorAll('.view');
    const navButtons = document.querySelectorAll('.nav-btn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authView = document.getElementById('authView');
    const profileView = document.getElementById('profileView');
    const token = localStorage.getItem('token');
  
    console.log("Token almacenado:", token);
  
    function showView(viewId) {
        views.forEach(view => {
            view.style.display = (view.id === viewId) ? 'block' : 'none';
        });
    }
  
    // 🚨 **FORZAR LOGIN SI NO HAY TOKEN**
    if (!token) {
        console.log("🔴 Usuario NO autenticado → Mostrando login");
        showView('authView');
    } else {
        console.log("🟢 Usuario autenticado → Mostrando perfil");
        authView.style.display = 'none'; // Ocultar formulario de login
        showView('profileView'); // Mostrar perfil
    }
  
    // ✅ **Manejo de navegación**
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.getAttribute('data-view') + 'View';
            console.log("Cambiando a vista:", view);
  
            if (!token && view !== 'authView') {
                showView('authView');
            } else {
                showView(view);
            }
        });
    });
  
    // ✅ **Cerrar sesión**
    if (logoutBtn) {
        logoutBtn.style.display = token ? 'block' : 'none';
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            console.log("🔴 Cerrando sesión...");
            window.location.reload();
        });
    }
  });