import { apiRequest } from "./js/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("bookingForm");
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");
    const serviceInput = document.getElementById("type");
    const dateError = document.getElementById("dateError");

    // 📅 Días permitidos (Lunes = 1, Miércoles = 3, Viernes = 5)
    const allowedDays = [1, 3, 5];

    // 🛑 Validar que el usuario seleccione una fecha válida
    dateInput.addEventListener("change", function () {
        const selectedDate = new Date(this.value);
        const selectedDay = selectedDate.getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showError(dateError, "⚠️ No puedes seleccionar una fecha pasada.");
            this.value = "";
        } else if (!allowedDays.includes(selectedDay)) {
            showError(dateError, "⚠️ Solo puedes reservar los lunes, miércoles y viernes.");
            this.value = "";
        } else {
            hideError(dateError);
        }
    });

    // ✅ Manejo del formulario de reservas
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const date = dateInput.value;
        const time = timeInput.value;
        const service = serviceInput.value;
        const token = localStorage.getItem("token");

        if (!token) {
            alert("⚠️ Debes iniciar sesión para hacer una reserva.");
            window.location.href = "login.html";
            return;
        }

        if (!date || !time || !service) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        try {
            const data = await apiRequest("/bookings/create", "POST", { date, time, service }, true);
            if (!data) return;

            alert("✅ Reserva creada con éxito.");
            bookingForm.reset();
        } catch (error) {
            alert(error.message);
        }
    });
});

// 🛑 Función para mostrar errores
function showError(element, message) {
    element.innerText = message;
    element.style.display = "block";
}

// ✅ Función para ocultar errores
function hideError(element) {
    element.style.display = "none";
}