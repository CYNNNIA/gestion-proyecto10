document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const nombreSpan = document.getElementById("nombreUsuario");
  const correoSpan = document.getElementById("correoUsuario");
  const rolSpan = document.getElementById("rolUsuario");
  const listaReservas = document.getElementById("listaReservas");

  if (!token) {
    alert("⚠️ Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  // Mostrar datos de usuario
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    nombreSpan.textContent = user.name || "-";
    correoSpan.textContent = user.email || "-";
    rolSpan.textContent = user.role || "-";
  }

  // Cargar reservas
  try {
    const res = await fetch("http://127.0.0.1:5002/api/bookings/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    console.log("📦 Reservas recibidas:", data);

    if (!Array.isArray(data)) {
      listaReservas.innerHTML = "<li>❌ Error al obtener tus reservas.</li>";
      return;
    }

    if (data.length === 0) {
      listaReservas.innerHTML = "<li>No tienes reservas activas.</li>";
      return;
    }

    listaReservas.innerHTML = "";

    data.forEach(reserva => {
      const li = document.createElement("li");
      const servicioNombre = reserva?.service?.name || "Servicio eliminado";
      const fechaHora = new Date(`${reserva.date}T${reserva.time}`).toLocaleString("es-ES");

      li.textContent = `${servicioNombre} - ${fechaHora}`;
      listaReservas.appendChild(li);
    });

  } catch (error) {
    console.error("❌ Error al cargar reservas:", error);
    listaReservas.innerHTML = "<li>⚠️ No se pudieron cargar las reservas.</li>";
  }
});