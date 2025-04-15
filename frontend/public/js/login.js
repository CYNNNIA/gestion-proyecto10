document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase(); // <-- cuidado con espacios y mayúsculas
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
      alert("❌ " + (data.message || "Error desconocido al iniciar sesión."));
      return;
    }

    // Guardar token y redirigir según rol
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);

    const redirectPage = data.user.role === "profesional"
      ? "dashboard-profesional.html"
      : "cliente.html";

    window.location.href = redirectPage;

  } catch (err) {
    console.error("❌ Error de red:", err);
    alert("⚠️ No se pudo conectar al servidor.");
  }
});