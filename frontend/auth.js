import { fetchAPI } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authMessage = document.getElementById('authMessage');
    const nameInput = document.getElementById('name');
    const bookingSection = document.getElementById('bookingSection');
    const authSection = document.getElementById('authSection');

    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');
    if (token) {
        authSection.style.display = 'none';
        bookingSection.style.display = 'block';
    }

    // Manejar el cambio entre login y registro
    registerBtn.addEventListener('click', () => {
        nameInput.style.display = 'block';
        authForm.dataset.authType = 'register';
    });

    loginBtn.addEventListener('click', () => {
        nameInput.style.display = 'none';
        authForm.dataset.authType = 'login';
    });

    // Manejar el formulario de autenticación
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const authType = authForm.dataset.authType;
        const name = nameInput.value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let endpoint = authType === 'register' ? '/users/register' : '/users/login';
        let body = authType === 'register' ? { name, email, password } : { email, password };

        const response = await fetchAPI(endpoint, 'POST', body);

        if (response.token) {
            localStorage.setItem('token', response.token);
            authSection.style.display = 'none';
            bookingSection.style.display = 'block';
        } else {
            authMessage.textContent = response.message || 'Error en la autenticación';
        }
    });

    // Cerrar sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        authSection.style.display = 'block';
        bookingSection.style.display = 'none';
    });
});