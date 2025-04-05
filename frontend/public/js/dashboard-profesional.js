// frontend/js/dashboard-profesional.js

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
const availabilityInput = document.getElementById("availabilityInput");
const availabilityList = document.getElementById("availabilityList");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const addAvailabilityBtn = document.getElementById("addAvailabilityBtn");
const serviceList = document.getElementById("serviceList");
const reservasList = document.getElementById("listaReservasRecibidas");
const filtroServicio = document.getElementById("filtroServicio");
const professionalName = document.getElementById("professionalName");

let reservas = [];
let editingServiceId = null;
let currentAvailabilities = [];

// Navbar dinámica
fetch("components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
    const links = document.querySelector("#navbar .nav-links");
    links.innerHTML = `
      <a href="dashboard-profesional.html">Mi Panel</a>
      <a href="#" onclick="logout()">Cerrar Sesión</a>
    `;
  });

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function getProfile() {
  const res = await fetch("http://localhost:5002/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  professionalName.textContent = data.name;
}

addAvailabilityBtn.addEventListener("click", () => {
  const date = availabilityInput.value;
  if (!date || new Date(date) < new Date()) {
    return alert("⚠️ Selecciona una fecha válida y futura.");
  }
  if (currentAvailabilities.includes(date)) {
    return alert("⚠️ Fecha duplicada.");
  }
  currentAvailabilities.push(date);
  renderAvailabilityList();
  availabilityInput.value = "";
});

function renderAvailabilityList() {
  availabilityList.innerHTML = "";
  currentAvailabilities.forEach((date, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = index;
    li.innerHTML = `
      ${new Date(date).toLocaleString()}
      <button type="button" onclick="removeAvailability(${index})">❌</button>
    `;
    availabilityList.appendChild(li);
  });
}

window.removeAvailability = (i) => {
  currentAvailabilities.splice(i, 1);
  renderAvailabilityList();
};

availabilityList.addEventListener("dragstart", e => {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
});

availabilityList.addEventListener("dragover", e => {
  e.preventDefault();
  const draggingOver = e.target.closest("li");
  if (draggingOver) draggingOver.style.border = "2px dashed #aaa";
});

availabilityList.addEventListener("drop", e => {
  e.preventDefault();
  const from = parseInt(e.dataTransfer.getData("text"));
  const to = parseInt(e.target.closest("li").dataset.index);
  const [moved] = currentAvailabilities.splice(from, 1);
  currentAvailabilities.splice(to, 0, moved);
  renderAvailabilityList();
});

async function loadServices() {
  const res = await fetch("http://localhost:5002/api/services/my-services", {
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
      ${s.image ? `<img src="http://localhost:5002${s.image}" width="150" />` : ""}
      <ul>
        ${(s.availability || []).map(a => `<li>${new Date(a.dateTime).toLocaleString()}</li>`).join("")}
      </ul>
      <button onclick="deleteService('${s._id}')">Eliminar</button>
      <button onclick="editService('${s._id}')">Editar</button>
    `;
    serviceList.appendChild(div);

    const opt = document.createElement("option");
    opt.value = s._id;
    opt.textContent = s.name;
    filtroServicio.appendChild(opt);
  });
}

serviceForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = nameInput.value;
  const description = descInput.value;
  const price = parseFloat(priceInput.value);
  const category = categoryInput.value;
  const image = imageInput.files[0];

  if (!name || !description || !price || !category) {
    return alert("⚠️ Todos los campos son obligatorios.");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  if (image) formData.append("image", image);
  currentAvailabilities.forEach(date => formData.append("availability", date));

  const url = editingServiceId
    ? `http://localhost:5002/api/services/${editingServiceId}`
    : "http://localhost:5002/api/services/create";

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
  currentAvailabilities = [];
  editingServiceId = null;
  cancelEditBtn.style.display = "none";
  document.querySelector("button[type='submit']").textContent = "Crear Servicio";
  renderAvailabilityList();
  await loadServices();
});

cancelEditBtn.addEventListener("click", () => {
  editingServiceId = null;
  currentAvailabilities = [];
  renderAvailabilityList();
  serviceForm.reset();
  cancelEditBtn.style.display = "none";
  document.querySelector("button[type='submit']").textContent = "Crear Servicio";
});

async function editService(id) {
  const res = await fetch(`http://localhost:5002/api/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const s = await res.json();
  nameInput.value = s.name;
  descInput.value = s.description;
  priceInput.value = s.price;
  categoryInput.value = s.category;
  editingServiceId = s._id;
  currentAvailabilities = (s.availability || []).map(a => a.dateTime);
  renderAvailabilityList();
  cancelEditBtn.style.display = "inline-block";
  document.querySelector("button[type='submit']").textContent = "Guardar Cambios";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteService(id) {
  if (!confirm("¿Eliminar este servicio?")) return;
  await fetch(`http://localhost:5002/api/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await loadServices();
}

async function loadReservas() {
  const res = await fetch("http://localhost:5002/api/bookings/professional", {
    headers: { Authorization: `Bearer ${token}` },
  });
  reservas = await res.json();
  showReservas();
}

function showReservas() {
  const selectedId = filtroServicio.value;
  const filtradas = selectedId ? reservas.filter(r => r.service._id === selectedId) : reservas;
  reservasList.innerHTML = "";
  if (filtradas.length === 0) {
    reservasList.innerHTML = "<li>No hay reservas.</li>";
    return;
  }
  filtradas.forEach(r => {
    const fecha = new Date(r.date).toLocaleString("es-ES");
    const li = document.createElement("li");
    li.textContent = `${r.service.name} - ${fecha} | Cliente: ${r.user.name} (${r.user.email})`;
    reservasList.appendChild(li);
  });
}

filtroServicio.addEventListener("change", showReservas);

(async () => {
  try {
    await getProfile();
    await loadServices();
    await loadReservas();
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
