document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  try {
    // Show loading state
    const submitBtn = document.querySelector(".btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      // Redirect to account page
      window.location.href = "index.html";
    } else {
      alert(result.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Error connecting to server. Please try again later.");
  } finally {
    // Reset button state
    const submitBtn = document.querySelector(".btn");
    submitBtn.disabled = false;
    submitBtn.textContent = "Login";
  }
});
