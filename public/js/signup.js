document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.querySelector(
    'input[placeholder="Enter Your Name"]'
  ).value;
  const email = document.querySelector('input[type="email"]').value;
  const username = document.querySelector(
    'input[placeholder="Enter Your Username"]'
  ).value;
  const password = document.querySelector('input[type="password"]').value;

  try {
    // Show loading state
    const submitBtn = document.querySelector(".btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, username, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    alert("Registration successful! Please login.");
    window.location.href = "signin.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert(error.message || "Error connecting to server. Please try again.");
  } finally {
    // Reset button state
    const submitBtn = document.querySelector(".btn");
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
});
