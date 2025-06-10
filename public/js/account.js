document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.querySelector(".logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        // Clear client-side storage regardless of API response
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        window.location.href = "signin.html";
      } catch (error) {
        console.error("Logout error:", error);
        // Still proceed with client-side cleanup
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        window.location.href = "signin.html";
      }
    });
  }
});
