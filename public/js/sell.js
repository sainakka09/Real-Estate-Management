// document
//   .getElementById("propertyForm")
//   .addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const form = e.target;
//     const formData = new FormData(form);

//     // Assuming you store the logged-in user's ID in localStorage after login
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       alert("Please sign in to list a property.");
//       return;
//     }

//     formData.append("owner", userId);

//     try {
//       const response = await fetch("http://localhost:5000/api/properties", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert("Property listed successfully!");
//         window.location.href = "account.html"; // Redirect to user listings
//       } else {
//         alert(result.message || "Listing failed");
//       }
//     } catch (error) {
//       console.error("Listing error:", error);
//       alert("An error occurred while submitting the property.");
//     }
//   });
document
  .getElementById("propertyForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const propertyData = {
      location: formData.get("location"),
      type: formData.get("type"),
      bhk: formData.get("bhk"),
      price: formData.get("price"),
      squareFeet: formData.get("squareFeet"),
      contactNumber: formData.get("contactNumber"),
      description: formData.get("description"),
      images: [],
    };

    // Handle image files
    const imageFiles = document.getElementById("propertyImages").files;
    for (let i = 0; i < Math.min(imageFiles.length, 10); i++) {
      const reader = new FileReader();
      reader.onload = function (e) {
        propertyData.images.push(e.target.result);

        // When all images are processed, save and redirect
        if (propertyData.images.length === Math.min(imageFiles.length, 10)) {
          saveProperty(propertyData);
        }
      };
      reader.readAsDataURL(imageFiles[i]);
    }

    // If no images, still save the property
    if (imageFiles.length === 0) {
      saveProperty(propertyData);
    }
  });

function saveProperty(propertyData) {
  // Get existing properties or initialize empty array
  let properties = JSON.parse(localStorage.getItem("properties")) || [];

  // Add new property
  properties.push(propertyData);

  // Save back to localStorage
  localStorage.setItem("properties", JSON.stringify(properties));

  // Redirect to buy page
  window.location.href = "buy.html";
}

// Image preview functionality
document
  .getElementById("propertyImages")
  .addEventListener("change", function () {
    const preview = document.getElementById("imagePreview");
    preview.innerHTML = "";

    const files = this.files;
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.width = "100px";
        img.style.height = "auto";
        img.style.margin = "5px";
        preview.appendChild(img);
      };
      reader.readAsDataURL(files[i]);
    }
  });
                           