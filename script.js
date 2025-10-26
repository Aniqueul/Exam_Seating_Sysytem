const API_BASE = "http://localhost:5000/api/auth";

async function registerUser() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  message.textContent = "⏳ Registering...";

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    message.textContent = data.message;

    if (res.ok) {
      message.style.color = "#00ff88";
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } else {
      message.style.color = "red";
    }
  } catch (err) {
    message.textContent = "❌ Failed to connect to server.";
    message.style.color = "red";
  }
}

async function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  message.textContent = "⏳ Logging in...";

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    message.textContent = data.message;

    if (res.ok) {
      message.style.color = "#00ff88";
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => (window.location.href = "index.html"), 1500);
    } else {
      message.style.color = "red";
    }
  } catch (err) {
    message.textContent = "❌ Failed to connect to server.";
    message.style.color = "red";
  }
}
