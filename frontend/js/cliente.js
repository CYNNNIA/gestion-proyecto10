document.addEventListener("DOMContentLoaded", async () => {
  console.log("📦 cliente.js cargado");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  // Obtener datos del usuario desde localStorage
  const nombre = localStorage.getItem("userName") || "Cliente";
  const email = localStorage.getItem("userEmail") || "No disponible";
  const rol = localStorage.getItem("userRole") || "cliente";

  // Asignar valores a los elementos SOLO si existen
  const clienteNombre = document.getElementById("clienteNombre");
  const nombreUsuario = document.getElementById("nombreUsuario");
  const correoUsuario = document.getElementById("correoUsuario");
  const rolUsuario = document.getElementById("rolUsuario");

  if (clienteNombre) clienteNombre.textContent = nombre;
  if (nombreUsuario) nombreUsuario.textContent = nombre;
  if (correoUsuario) correoUsuario.textContent = email;
  if (rolUsuario) rolUsuario.textContent = rol.charAt(0).toUpperCase() + rol.slice(1);

  // Cargar reservas (si tienes esta funcionalidad lista)
  const listaReservas = document.getElementById("listaReservas");

  try {
    const response = await fetch("http://127.0.0.1:5002/api/bookings/user", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error cargando reservas.");

    if (listaReservas) {
      listaReservas.innerHTML = "";

      if (data.reservas && data.reservas.length > 0) {
        data.reservas.forEach(reserva => {
          const li = document.createElement("li");
          li.textContent = `Reserva: ${reserva.serviceName} - ${new Date(reserva.date).toLocaleString()}`;
          listaReservas.appendChild(li);
        });
      } else {
        listaReservas.innerHTML = "<li>No tienes reservas activas.</li>";
      }
    }

  } catch (error) {
    console.error("❌ Error al cargar las reservas:", error);
  }
});