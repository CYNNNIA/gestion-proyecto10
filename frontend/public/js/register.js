document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || !password || !role) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ Error: " + (data.message || "Error desconocido"));
      return;
    }

    // 🟢 Guardar token automáticamente tras registro
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role); // si lo usas para redirecciones

    alert("✅ Registro exitoso. Sesión iniciada automáticamente.");

    // 🧭 Redirigir directamente según rol
    if (data.user.role === "profesional") {
      window.location.href = "dashboard-profesional.html";
    } else {
      window.location.href = "cliente.html";
    }

  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    alert("⚠️ Error en el servidor. Intenta más tarde.");
  }
});