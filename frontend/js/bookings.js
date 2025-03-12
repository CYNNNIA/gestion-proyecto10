document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById("bookingForm");
    const dateInput = document.getElementById("date");
    const dateError = document.getElementById("dateError");

    // Días permitidos (Lunes = 1, Miércoles = 3, Viernes = 5)
    const allowedDays = [1, 3, 5];

    // ❌ Validar que el usuario solo seleccione los días permitidos
    dateInput.addEventListener("change", function () {
        const selectedDate = new Date(this.value);
        const selectedDay = selectedDate.getUTCDay(); // Obtener día de la semana

        if (!allowedDays.includes(selectedDay)) {
            dateError.style.display = "block"; // Mostrar el mensaje de error
            this.value = ""; // Borrar la fecha seleccionada
        } else {
            dateError.style.display = "none"; // Ocultar el mensaje de error
        }
    });

    // ✅ Manejo del formulario de reservas
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const date = dateInput.value;
        const time = document.getElementById("time").value;
        const service = document.getElementById("type").value;

        if (!date) {
            dateError.style.display = "block";
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5002/api/bookings/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ date, time, service })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al reservar la cita.");
            }

            alert("Reserva creada con éxito.");
            bookingForm.reset();
        } catch (error) {
            alert(error.message);
        }
    });
});