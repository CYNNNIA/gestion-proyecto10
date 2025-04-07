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

async function cargarReservas() {
  const res = await fetch("http://localhost:5002/api/bookings/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const reservas = await res.json();

  reservasList.innerHTML = "";
  if (reservas.length === 0) {
    reservasList.innerHTML = "<li>No tienes reservas aún.</li>";
    return;
  }

  for (const r of reservas) {
    const fechaHora = `${r.date} ${r.time}`;
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${r.service?.name || "(Sin nombre)"}</strong> - ${fechaHora}<br>
      <button onclick="abrirModalEdicion('${r._id}', '${r.service._id}')">Editar</button>
      <button onclick="cancelarReserva('${r._id}')">Cancelar</button>
    `;
    reservasList.appendChild(li);
  }
}

window.abrirModalEdicion = async (bookingId, serviceId) => {
  editBookingId.value = bookingId;
  editDatetime.innerHTML = "";

  const res = await fetch(`http://localhost:5002/api/availability/service/${serviceId}`);
  const disponibilidad = await res.json();

  const ahora = new Date();
  const futureOptions = disponibilidad
    .filter(d => new Date(d.dateTime) > ahora)
    .map(d => {
      const fecha = new Date(d.dateTime);
      return {
        value: fecha.toISOString(),
        label: `${fecha.toLocaleDateString()} ${fecha.toTimeString().slice(0, 5)}`
      };
    });

  if (futureOptions.length === 0) {
    editDatetime.innerHTML = '<option value="">No hay disponibilidad</option>';
    editDatetime.disabled = true;
  } else {
    editDatetime.innerHTML = futureOptions
      .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
      .join("");
    editDatetime.disabled = false;
  }

  editModal.style.display = "flex";
};

cancelEditBtn.onclick = () => {
  editModal.style.display = "none";
};

editBookingForm.onsubmit = async e => {
  e.preventDefault();
  const id = editBookingId.value;
  const iso = editDatetime.value;
  if (!iso || iso === "Invalid Date") return alert("❌ Selecciona una fecha y hora válida.");

  const [date, time] = iso.split("T");

  const res = await fetch(`http://localhost:5002/api/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, time: time.slice(0, 5) }),
  });

  const data = await res.json();
  if (!res.ok) return alert("❌ " + (data.message || "Error modificando reserva"));

  alert("✅ Reserva modificada correctamente.");
  editModal.style.display = "none";
  await cargarReservas();
};

window.cancelarReserva = async id => {
  if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
  const res = await fetch(`http://localhost:5002/api/bookings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return alert("❌ Error: " + (data.message || "Error cancelando."));
  alert("✅ Reserva cancelada.");
  await cargarReservas();
};

(async () => {
  await loadClientProfile();
  await cargarReservas();
})();
