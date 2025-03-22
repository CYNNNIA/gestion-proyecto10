document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");

  registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const role = document.getElementById("registerRole").value;

      try {
          const response = await fetch("http://127.0.0.1:5002/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password, role })
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          alert("✅ Registro exitoso. Ahora inicia sesión.");
          window.location.href = "login.html";

      } catch (error) {
          errorMessage.innerText = `⚠️ ${error.message}`;
          errorMessage.style.display = "block";
      }
  });
});