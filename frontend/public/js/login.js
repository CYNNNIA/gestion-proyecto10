document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Error en login:", data.message);
      alert("❌ " + (data.message || "Credenciales inválidas."));
      return;
    }

    // Guardar token y datos del usuario
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);

    // Redirigir según el rol
    if (data.user.role === "profesional") {
      window.location.href = "dashboard-profesional.html";
    } else {
      window.location.href = "cliente.html";
    }
  } catch (err) {
    console.error("❌ Error en el servidor:", err);
    alert("⚠️ Error del servidor. Intenta más tarde.");
  }
});