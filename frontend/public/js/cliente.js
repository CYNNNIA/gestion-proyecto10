// public/js/cliente.js
const token = localStorage.getItem("token");
if (!token) {
  alert("⚠️ Debes iniciar sesión.");
  window.location.href = "login.html";
}

const clientName = document.getElementById("clientName");
const clientEmail = document.getElementById("clientEmail");
const clientRole = document.getElementById("clientRole");
const reservasList = document.getElementById("reservasList");

// Obtener perfil
async function loadClientProfile() {
  try {
    const res = await fetch("http://localhost:5002/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    clientName.textContent = data.name;
    clientEmail.textContent = data.email;
    clientRole.textContent = data.role;
  } catch (error) {
    console.error("Error al cargar perfil", error);
  }
}

// Obtener reservas del cliente
async function loadClientBookings() {
  try {
    const res = await fetch("http://localhost:5002/api/bookings/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const bookings = await res.json();

    reservasList.innerHTML = "";
    if (!bookings.length) {
      reservasList.innerHTML = "<li>No tienes reservas.</li>";
      return;
    }

    bookings.forEach((b) => {
      const li = document.createElement("li");
      const fecha = new Date(`${b.date}T${b.time}`).toLocaleString("es-ES");
      li.innerHTML = `
        <strong>${b.service?.name || "(servicio eliminado)"}</strong><br>
        Fecha: ${fecha}<br>
        <button onclick="cancelarReserva('${b._id}')">❌ Cancelar</button>
        <button onclick="editarReserva('${b._id}', '${b.date}', '${b.time}')">✏️ Editar</button>
      `;
      reservasList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al obtener reservas", error);
  }
}

// Cancelar
async function cancelarReserva(id) {
  if (!confirm("¿Cancelar esta reserva?")) return;
  await fetch(`http://localhost:5002/api/bookings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await loadClientBookings();
}

// Editar
async function editarReserva(id, oldDate, oldTime) {
  const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD):", oldDate);
  const nuevaHora = prompt("Nueva hora (HH:MM):", oldTime);
  if (!nuevaFecha || !nuevaHora) return;

  const res = await fetch(`http://localhost:5002/api/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date: nuevaFecha, time: nuevaHora }),
  });

  const data = await res.json();
  if (!res.ok) return alert("❌ " + data.message);
  alert("✅ Reserva actualizada.");
  await loadClientBookings();
}

(async () => {
  await loadClientProfile();
  await loadClientBookings();
})();