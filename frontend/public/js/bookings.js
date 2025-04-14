document.addEventListener("DOMContentLoaded", async () => {
  const serviciosContainer = document.getElementById("serviciosContainer");
  const listaReservas = document.getElementById("listaReservas");
  const filtroModalidad = document.getElementById("filtroModalidad");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  if (filtroModalidad) {
    filtroModalidad.addEventListener("change", () => {
      cargarServiciosYDisponibilidad();
    });
  }

  async function cargarServiciosYDisponibilidad() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/services`);
      const servicios = await res.json();

      const modalidadSeleccionada = filtroModalidad?.value || "todas";
      serviciosContainer.innerHTML = "";

      for (const servicio of servicios) {
        if (modalidadSeleccionada !== "todas" && servicio.modality !== modalidadSeleccionada) {
          continue;
        }

        const disponibilidadRes = await fetch(`${API_BASE_URL}/api/availability/service/${servicio._id}`);
        const disponibilidad = await disponibilidadRes.json();

        const disponibilidadFiltrada = disponibilidad.filter(d =>
          d.service === servicio._id || (d.service?._id && d.service._id === servicio._id)
        );

        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
          <h3>${servicio.name}</h3>
          <p>${servicio.description}</p>
          <p><strong>${servicio.category}</strong> - ${Number(servicio.price).toFixed(2)}€</p>
          <p><em>${servicio.modality === "online" ? "🌐 Online" : "🏠 Presencial"}</em></p>
          ${servicio.image ? `<img src="${API_BASE_URL}${servicio.image}" width="150" />` : ""}
          <select id="select-${servicio._id}" class="availability-select">
            <option value="">Selecciona fecha y hora</option>
            ${disponibilidadFiltrada.map(d => {
              const dt = new Date(d.dateTime);
              return `<option value="${d.dateTime}">${dt.toLocaleDateString()} ${dt.toTimeString().slice(0, 5)}</option>`;
            }).join("")}
          </select>
          <button onclick="reservarServicio('${servicio._id}')">Reservar</button>
        `;
        serviciosContainer.appendChild(div);
      }
    } catch (err) {
      console.error("❌ Error cargando servicios:", err);
      alert("❌ Error cargando servicios disponibles.");
    }
  }

  window.reservarServicio = async (serviceId) => {
    const select = document.getElementById(`select-${serviceId}`);
    const datetime = select.value;

    if (!datetime) return alert("⚠️ Selecciona una fecha y hora válida.");

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ service: serviceId, datetime }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error creando reserva");

      alert("✅ Reserva creada con éxito.");
      await cargarServiciosYDisponibilidad();
      await mostrarMisReservas();
    } catch (err) {
      console.error("❌ Error reservando:", err);
      alert("❌ " + err.message);
    }
  };

  window.cancelarReserva = async (id) => {
    if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Reserva cancelada.");

      await new Promise(resolve => setTimeout(resolve, 500));
      await cargarServiciosYDisponibilidad();
      await mostrarMisReservas();
    } catch (err) {
      console.error("❌ Error cancelando reserva:", err);
      alert("❌ " + err.message);
    }
  };

  async function mostrarMisReservas() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      listaReservas.innerHTML = "";
      if (!data.length) {
        listaReservas.innerHTML = "<li>No tienes reservas aún.</li>";
        return;
      }

      data.forEach(reserva => {
        const li = document.createElement("li");
        let fecha;
        if (reserva.date && reserva.time) {
          fecha = new Date(`${reserva.date}T${reserva.time}`).toLocaleString("es-ES");
        } else if (reserva.datetime) {
          fecha = new Date(reserva.datetime).toLocaleString("es-ES");
        } else {
          fecha = "Fecha inválida";
        }
        const statusInfo = reserva.status === "cancelada" ? '<span style="color:red"> (cancelada)</span>' : "";
        li.innerHTML = `
          <strong>${reserva.service?.name || "Servicio"}</strong> - ${fecha}${statusInfo}
          ${reserva.status !== "cancelada" ? `<button onclick="cancelarReserva('${reserva._id}')">Cancelar</button>` : ""}
        `;
        listaReservas.appendChild(li);
      });
    } catch (err) {
      console.error("❌ Error mostrando reservas:", err);
    }
  }

  await cargarServiciosYDisponibilidad();
  await mostrarMisReservas();
});