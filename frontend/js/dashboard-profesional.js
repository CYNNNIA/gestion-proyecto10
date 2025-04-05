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
const availabilityInput = document.getElementById("availabilityPicker");
const serviceList = document.getElementById("serviceList");
const reservasList = document.getElementById("listaReservasRecibidas");
const filtroServicio = document.getElementById("filtroServicio");
const professionalName = document.getElementById("professionalName");

let reservas = [];

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
  if (!res.ok) throw new Error("Perfil inválido");
  const data = await res.json();
  professionalName.textContent = data.name;
}

async function loadServices() {
  const res = await fetch("http://localhost:5002/api/services/my-services", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const services = await res.json();
  if (!Array.isArray(services)) throw new Error("Respuesta no válida");

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
        ${(s.availabilities || []).map(a => `<li>${new Date(a).toLocaleString()}</li>`).join("")}
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

// Crear servicio
serviceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const description = descInput.value.trim();
  const price = parseFloat(priceInput.value);
  const category = categoryInput.value;
  const availability = availabilityInput.value;
  const image = imageInput.files[0];

  if (!name || !description || !price || !category || !availability || !image) {
    return alert("⚠️ Todos los campos son obligatorios.");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("image", image);
  formData.append("availability", availability); // como string

  const res = await fetch("http://localhost:5002/api/services/create", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) return alert("❌ Error al crear servicio: " + result.message);

  alert("✅ Servicio creado con éxito.");
  serviceForm.reset();
  loadServices();
});

async function deleteService(id) {
  if (!confirm("¿Eliminar este servicio?")) return;
  await fetch(`http://localhost:5002/api/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadServices();
}

(async () => {
  try {
    await getProfile();
    await loadServices();
    await loadReservas();
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();