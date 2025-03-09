import { fetchAPI } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const bookingsList = document.getElementById('bookingsList');
    const token = localStorage.getItem('token');

    // Verificar si el usuario está logueado antes de permitir reservas
    if (!token) {
        console.error('No hay usuario autenticado.');
        return;
    }

    // Función para cargar reservas del usuario
    async function loadBookings() {
        const bookings = await fetchAPI('/bookings/', 'GET', null, token);

        bookingsList.innerHTML = ''; // Limpiar lista antes de actualizar
        if (bookings.error) {
            bookingsList.innerHTML = `<li>Error cargando reservas</li>`;
            return;
        }

        bookings.forEach(booking => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${booking.date} - ${booking.serviceType} 
                <button class="cancelBtn" data-id="${booking._id}">Cancelar</button>
            `;
            bookingsList.appendChild(li);
        });

        // Agregar evento a los botones de cancelar
        document.querySelectorAll('.cancelBtn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const bookingId = e.target.dataset.id;
                await fetchAPI(`/bookings/${bookingId}`, 'PUT', null, token);
                loadBookings(); // Recargar la lista después de cancelar
            });
        });
    }

    // Manejar la reserva de citas
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const serviceType = document.getElementById('serviceType').value;

        const response = await fetchAPI('/bookings/', 'POST', { date, serviceType }, token);
        if (!response.error) {
            loadBookings(); // Recargar reservas
            bookingForm.reset();
        } else {
            console.error('Error al crear la reserva:', response.message);
        }
    });

    // Cargar reservas al iniciar
    loadBookings();
});