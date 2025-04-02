document.addEventListener("DOMContentLoaded", async () => {
  const bookingForm = document.getElementById("bookingForm");
  const dateSelect = document.getElementById("date");
  const timeSelect = document.getElementById("time");
  const serviceSelect = document.getElementById("type");
  const dateError = document.getElementById("dateError");
  const listaReservas = document.getElementById("listaReservas");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  let servicios = [];
  let disponibilidadPorFecha = {};

  async function cargarServicios() {
    try {
      const res = await fetch("http://127.0.0.1:5002/api/services");
      const data = await res.json();
      servicios = data;

      data.forEach(service => {
        const option = document.createElement("option");
        option.value = service._id;
        option.textContent = `${service.name} (${service.category}) - ${service.price}€`;
        serviceSelect.appendChild(option);
      });
    } catch (error) {
      alert("❌ No se pudieron cargar los servicios. Intenta más tarde.");
      console.error("❌ Error al cargar servicios:", error);
    }
  }

  serviceSelect.addEventListener("change", async () => {
    const servicioId = serviceSelect.value;
    const servicioSeleccionado = servicios.find(s => s._id === servicioId);
    if (!servicioSeleccionado) {
      alert("⚠️ Servicio no encontrado.");
      return;
    }
  
    // ✅ CORREGIDO: sacar solo el _id del profesional
    const professionalId = servicioSeleccionado.professional._id;
  
    if (!professionalId) {
      alert("⚠️ Este servicio no tiene un profesional asignado.");
      return;
    }
  
    try {
      await cargarDisponibilidadDelProfesional(professionalId);
    } catch (err) {
      console.error("❌ Error cargando disponibilidad:", err);
      alert("❌ No se pudo obtener la disponibilidad. Verifica si el profesional tiene disponibilidad registrada.");
    }
  });

  async function cargarDisponibilidadDelProfesional(professionalId) {
    try {
      const res = await fetch(`http://127.0.0.1:5002/api/availability/professional/${professionalId}`);

      if (!res.ok) {
        throw new Error(`⚠️ No se pudo obtener la disponibilidad (código ${res.status})`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("❌ La respuesta del servidor no tiene el formato esperado.");
      }

      disponibilidadPorFecha = {};
      dateSelect.innerHTML = `<option value="">Selecciona una fecha</option>`;
      timeSelect.innerHTML = `<option value="">Selecciona una hora</option>`;

      data.forEach(item => {
        const dt = new Date(item.dateTime);
        const fecha = dt.toISOString().split("T")[0];
        const hora = dt.toTimeString().slice(0, 5);

        if (!disponibilidadPorFecha[fecha]) {
          disponibilidadPorFecha[fecha] = [];
        }
        disponibilidadPorFecha[fecha].push(hora);
      });

      if (Object.keys(disponibilidadPorFecha).length === 0) {
        alert("⚠️ El profesional seleccionado no tiene disponibilidad.");
        return;
      }

      Object.keys(disponibilidadPorFecha).forEach(fecha => {
        const option = document.createElement("option");
        option.value = fecha;
        option.textContent = fecha;
        dateSelect.appendChild(option);
      });

    } catch (error) {
      alert(`❌ Error al cargar disponibilidad: ${error.message}`);
      console.error(error);
    }
  }

  dateSelect.addEventListener("change", () => {
    const fechaSeleccionada = dateSelect.value;
    const horas = disponibilidadPorFecha[fechaSeleccionada] || [];
    timeSelect.innerHTML = `<option value="">Selecciona una hora</option>`;

    if (horas.length === 0) {
      showError(dateError, "⚠️ No hay disponibilidad para esta fecha.");
    } else {
      hideError(dateError);
      horas.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        timeSelect.appendChild(option);
      });
    }
  });

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = dateSelect.value;
    const time = timeSelect.value;
    const service = serviceSelect.value;

    if (!date || !time || !service) {
      alert("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5002/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, time, service }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Reserva creada con éxito.");
      bookingForm.reset();
      listaReservas.innerHTML = "";
      await mostrarMisReservas();

    } catch (error) {
      alert(`❌ Error al crear la reserva: ${error.message}`);
    }
  });

  async function mostrarMisReservas() {
    try {
      const res = await fetch("http://127.0.0.1:5002/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      listaReservas.innerHTML = "";
      if (!Array.isArray(data) || data.length === 0) {
        listaReservas.innerHTML = "<li>No tienes reservas aún.</li>";
        return;
      }

      data.forEach(reserva => {
        const li = document.createElement("li");
        const fecha = new Date(reserva.date).toLocaleDateString("es-ES");
        li.textContent = `${reserva.service?.name || 'Servicio'} - ${fecha} ${reserva.time}`;
        listaReservas.appendChild(li);
      });

    } catch (error) {
      alert("❌ Error al cargar tus reservas.");
      console.error(error);
    }
  }

  function showError(element, message) {
    element.innerText = message;
    element.style.display = "block";
  }

  function hideError(element) {
    element.style.display = "none";
  }

  await cargarServicios();
  await mostrarMisReservas();
});
