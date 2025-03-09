document.addEventListener('DOMContentLoaded', async () => {
    const bookingsList = document.getElementById('bookingsList'); // 💡 Asegúrate de que este elemento existe en el HTML
    const token = localStorage.getItem('token');

    if (!token) {
        console.log("🔴 No hay token, redirigiendo a login...");
        return;
    }

    async function loadUserBookings() {
        try {
            const response = await fetch('http://localhost:5002/api/bookings', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const bookings = await response.json();
            console.log("📅 Reservas cargadas:", bookings);

            bookingsList.innerHTML = bookings.length > 0
                ? bookings.map(booking => `<li>${booking.date} - ${booking.service}</li>`).join('')
                : "<p>No tienes reservas aún.</p>";

        } catch (error) {
            console.error("⚠️ Error al cargar reservas:", error);
            bookingsList.innerHTML = "<p>Error al cargar reservas.</p>";
        }
    }

    loadUserBookings();
});