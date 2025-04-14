const token = localStorage.getItem("token");
if (!token) {
  alert("⚠️ Debes iniciar sesión.");
  window.location.href = "login.html";
}

const clientName = document.getElementById("clientName");
const clientEmail = document.getElementById("clientEmail");
const clientRole = document.getElementById("clientRole");
const reservasList = document.getElementById("reservasList");
const editModal = document.getElementById("editModal");
const editBookingForm = document.getElementById("editBookingForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editBookingId = document.getElementById("editBookingId");
const editDatetime = document.getElementById("editDatetime");

async function loadClientProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
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

async function cargarReservas() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const reservas = await res.json();

    reservasList.innerHTML = "";
    if (reservas.length === 0) {
      reservasList.innerHTML = "<li>No tienes reservas aún.</li>";
      return;
    }

    for (const r of reservas) {
      const fechaHora = new Date(r.datetime).toLocaleString("es-ES");
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${r.service?.name || "(Sin nombre)"}</strong> - ${fechaHora}<br>
        ${r.status !== "cancelada" ? `
          <button onclick="abrirModalEdicion('${r._id}', '${r.service._id}')">Editar</button>
          <button onclick="cancelarReserva('${r._id}')">Cancelar</button>
        ` : `<span style="color: red;">Reserva cancelada</span>`}
      `;
      reservasList.appendChild(li);
    }
  } catch (err) {
    console.error("❌ Error al cargar reservas:", err);
    reservasList.innerHTML = "<li>Error al cargar reservas.</li>";
  }
}

window.abrirModalEdicion = async (bookingId, serviceId) => {
  editBookingId.value = bookingId;
  editDatetime.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE_URL}/api/availability/service/${serviceId}`);
    const disponibilidad = await res.json();

    const ahora = new Date();
    const opciones = disponibilidad
      .filter(d => new Date(d.dateTime) > ahora)
      .map(d => {
        const fecha = new Date(d.dateTime);
        return {
          value: fecha.toISOString(),
          label: `${fecha.toLocaleDateString()} ${fecha.toTimeString().slice(0, 5)}`
        };
      });

    if (opciones.length === 0) {
      editDatetime.innerHTML = '<option value="">No hay disponibilidad</option>';
      editDatetime.disabled = true;
    } else {
      editDatetime.innerHTML = opciones
        .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
        .join("");
      editDatetime.disabled = false;
    }

    editModal.style.display = "flex";
  } catch (error) {
    console.error("❌ Error obteniendo disponibilidad:", error);
  }
};

cancelEditBtn.onclick = () => {
  editModal.style.display = "none";
};

editBookingForm.onsubmit = async e => {
  e.preventDefault();
  const id = editBookingId.value;
  const datetime = editDatetime.value;

  if (!datetime || datetime === "Invalid Date") {
    return alert("❌ Selecciona una fecha y hora válida.");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ datetime }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Error al actualizar reserva:", data);
      return alert("❌ " + (data.message || "Error modificando reserva"));
    }

    alert("✅ Reserva modificada correctamente.");
    editModal.style.display = "none";
    await cargarReservas();
  } catch (error) {
    console.error("❌ Error en la solicitud PUT:", error);
    alert("❌ Error inesperado al actualizar reserva.");
  }
};

window.cancelarReserva = async id => {
  if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Error cancelando:", data);
      return alert("❌ " + (data.message || "Error cancelando."));
    }

    alert("✅ Reserva cancelada.");
    await cargarReservas();
  } catch (error) {
    console.error("❌ Error al cancelar reserva:", error);
    alert("❌ Error inesperado al cancelar reserva.");
  }
};

(async () => {
  await loadClientProfile();
  await cargarReservas();
})();