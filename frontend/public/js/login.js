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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`❌ ${data.message || "Error al iniciar sesión"}`);
      return;
    }

    // 🟢 Guardar el token y redirigir según el rol
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);

    if (data.user.role === "profesional") {
      window.location.href = "dashboard-profesional.html";
    } else {
      window.location.href = "cliente.html";
    }
  } catch (err) {
    console.error("❌ Error al iniciar sesión:", err);
    alert("⚠️ Error en el servidor. Intenta más tarde.");
  }
});