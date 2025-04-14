const token = localStorage.getItem("token");
if (!token) {
  alert("⚠️ Debes iniciar sesión.");
  window.location.href = "login.html";
}

const serviceForm = document.getElementById("serviceForm");
const nameInput = document.getElementById("serviceName");
const descInput = document.getElementById("serviceDescription");
const priceInput = document.getElementById("servicePrice");
const categoryInput = document.getElementById("serviceCategory");
const imageInput = document.getElementById("serviceImage");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const serviceList = document.getElementById("serviceList");
const reservasList = document.getElementById("listaReservasRecibidas");
const filtroServicio = document.getElementById("filtroServicio");
const professionalName = document.getElementById("professionalName");
const firstAvailabilityInput = document.getElementById("firstAvailabilityInput");

let reservas = [];
let editingServiceId = null;

async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  professionalName.textContent = data.name;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function loadServices() {
  const res = await fetch(`${API_BASE_URL}/api/services/my-services`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const services = await res.json();

  serviceList.innerHTML = "";
  filtroServicio.innerHTML = '<option value="">Todos los servicios</option>';

  services.forEach(s => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${s.name}</h3>
      <p>${s.description}</p>
      <p>${s.category} - ${Number(s.price).toFixed(2)}€</p>
      ${s.image ? `<img src="${API_BASE_URL}${s.image}" alt="Servicio" />` : ""}
      <input type="datetime-local" id="date-${s._id}" />
      <button onclick="addDate('${s._id}')">➕ Añadir Fecha</button>
      <ul>
        ${(s.availability || []).map(a => `
          <li>
            <span>${new Date(a.dateTime).toLocaleString()}</span>
            <button onclick="deleteAvailability('${a._id}')">❌</button>
          </li>`).join("")}
      </ul>
      <div class="action-buttons">
        <button onclick="deleteService('${s._id}')">Eliminar</button>
        <button onclick="editService('${s._id}')">Editar</button>
      </div>
    `;
    serviceList.appendChild(div);

    const opt = document.createElement("option");
    opt.value = s._id;
    opt.textContent = s.name;
    filtroServicio.appendChild(opt);
  });
}

window.addDate = async serviceId => {
  const input = document.getElementById(`date-${serviceId}`);
  const datetime = input.value;
  if (!datetime || new Date(datetime) < new Date()) return alert("⚠️ Fecha inválida");

  const res = await fetch(`${API_BASE_URL}/api/availability/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ service: serviceId, dateTime: datetime }),
  });

  const data = await res.json();
  if (!res.ok) return alert("❌ " + (data.message || "Error añadiendo disponibilidad"));
  await loadServices();
};

window.deleteAvailability = async id => {
  const res = await fetch(`${API_BASE_URL}/api/availability/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await loadServices();
};

async function editService(id) {
  const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const s = await res.json();
  nameInput.value = s.name;
  descInput.value = s.description;
  priceInput.value = s.price;
  categoryInput.value = s.category;
  editingServiceId = s._id;
  cancelEditBtn.style.display = "inline-block";
  document.querySelector("button[type='submit']").textContent = "Guardar Cambios";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteService(id) {
  if (!confirm("¿Eliminar este servicio?")) return;
  await fetch(`${API_BASE_URL}/api/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await loadServices();
}

serviceForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = nameInput.value;
  const description = descInput.value;
  const price = parseFloat(priceInput.value);
  const category = categoryInput.value;
  const image = imageInput.files[0];
  const firstAvailability = firstAvailabilityInput.value;

  if (!name || !description || !price || !category || !firstAvailability) {
    return alert("⚠️ Todos los campos son obligatorios.");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  if (image) formData.append("image", image);
  formData.append("availability", firstAvailability);

  const url = editingServiceId
    ? `${API_BASE_URL}/api/services/${editingServiceId}`
    : `${API_BASE_URL}/api/services/create`;

  const method = editingServiceId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) return alert("❌ Error: " + result.message);

  alert(`✅ Servicio ${editingServiceId ? "actualizado" : "creado"} correctamente.`);
  serviceForm.reset();
  editingServiceId = null;
  cancelEditBtn.style.display = "none";
  document.querySelector("button[type='submit']").textContent = "Crear Servicio";
  await loadServices();
});

cancelEditBtn.addEventListener("click", () => {
  editingServiceId = null;
  serviceForm.reset();
  cancelEditBtn.style.display = "none";
  document.querySelector("button[type='submit']").textContent = "Crear Servicio";
});

async function loadReservas() {
  const res = await fetch(`${API_BASE_URL}/api/bookings/professional`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  reservas = await res.json();
  showReservas();
}

function showReservas() {
  const selectedId = filtroServicio.value;
  const filtradas = reservas
    .filter(r => r.status !== "cancelada")
    .filter(r => !selectedId || r.service._id === selectedId);

  reservasList.innerHTML = "";

  if (filtradas.length === 0) {
    reservasList.innerHTML = "<li>No hay reservas.</li>";
    return;
  }

  filtradas.forEach(r => {
    const fecha = new Date(`${r.date}T${r.time}`).toLocaleString("es-ES");
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${r.service.name}</strong> - ${fecha}<br>
      Cliente: ${r.user.name} (${r.user.email})
      <button onclick="cancelarReservaProfesional('${r._id}')">Cancelar</button>
    `;
    reservasList.appendChild(li);
  });
}

window.cancelarReservaProfesional = async id => {
  if (!confirm("¿Cancelar esta reserva?")) return;
  
  const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    alert("❌ Error al cancelar reserva: " + (data.message || "Error desconocido"));
    return;
  }

  alert("✅ Reserva cancelada correctamente.");
  await loadReservas();
};

filtroServicio.addEventListener("change", showReservas);

(async () => {
  await getProfile();
  await loadServices();
  await loadReservas();
})();