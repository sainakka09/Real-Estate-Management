// window.addEventListener("DOMContentLoaded", async () => {
//   const container = document.querySelector(".row");
//   container.innerHTML = "";

//   try {
//     const response = await fetch("http://localhost:5000/api/properties");
//     const listings = await response.json();

//     listings.forEach((item) => {
//       container.innerHTML += `
//         <div class="car-card">
//           <img src="${item.images[0]}" alt="${item.type}" />
//           <h3>${item.type}</h3>
//           <p>${item.description}</p>
//           <p>${item.bhk}</p>
//           <p>${item.squareFeet} square feets</p>
//           <p>₹${item.price}</p>
//           <div class="centered-div">
//             <a href="https://wa.me/${item.contactNumber}" class="whatsapp-btn" target="_blank">
//               <img src="whatsapp-icon.png" style="width: 20px; vertical-align: middle" />
//               Message Owner
//             </a>
//           </div>
//           <div class="centered-div">
//             <a href="tel:${item.contactNumber}" class="dialer" target="_blank">
//               <img src="dialer.png" style="width: 18px; vertical-align: middle" />
//               Contact Owner
//             </a>
//           </div>
//         </div>`;
//     });
//   } catch (err) {
//     console.error("Error loading properties:", err);
//   }
// });
document.addEventListener("DOMContentLoaded", function () {
  // Get properties from localStorage
  const properties = JSON.parse(localStorage.getItem("properties")) || [];

  // Get the container where properties will be displayed
  const propertiesContainer = document.querySelector(".row");

  // Clear existing properties if needed
  // propertiesContainer.innerHTML = '';

  // Add each property to the page
  properties.forEach((property) => {
    const propertyCard = createPropertyCard(property);
    propertiesContainer.appendChild(propertyCard);
  });
});

function createPropertyCard(property) {
  // Create card element
  const card = document.createElement("div");
  card.className = "car-card";

  // Add image (use first image if available)
  if (property.images && property.images.length > 0) {
    const img = document.createElement("img");
    img.src = property.images[0];
    img.alt = property.type;
    card.appendChild(img);
  } else {
    // Default image if none provided
    const img = document.createElement("img");
    img.src = "default-property.jpg"; // You should provide a default image
    img.alt = "Property image";
    card.appendChild(img);
  }

  // Add property details
  const title = document.createElement("h3");
  title.textContent = `${property.type} (${property.bhk})`;
  card.appendChild(title);

  const location = document.createElement("p");
  location.textContent = property.location;
  card.appendChild(location);

  const price = document.createElement("p");
  price.textContent = `₹${property.price}`;
  card.appendChild(price);

  const size = document.createElement("p");
  size.textContent = `${property.squareFeet} sq.ft`;
  card.appendChild(size);

  const description = document.createElement("p");
  description.textContent = property.description;
  card.appendChild(description);

  // Add contact buttons
  const whatsappDiv = document.createElement("div");
  whatsappDiv.className = "centered-div";
  const whatsappLink = document.createElement("a");
  whatsappLink.href = `https://wa.me/${property.contactNumber}`;
  whatsappLink.className = "whatsapp-btn";
  whatsappLink.target = "_blank";

  const whatsappIcon = document.createElement("img");
  whatsappIcon.src = "whatsapp-icon.png";
  whatsappIcon.alt = "WhatsApp";
  whatsappIcon.style.width = "20px";
  whatsappIcon.style.verticalAlign = "middle";

  whatsappLink.appendChild(whatsappIcon);
  whatsappLink.appendChild(document.createTextNode(" Message Owner"));
  whatsappDiv.appendChild(whatsappLink);
  card.appendChild(whatsappDiv);

  const callDiv = document.createElement("div");
  callDiv.className = "centered-div";
  const callLink = document.createElement("a");
  callLink.href = `tel:${property.contactNumber}`;
  callLink.className = "dialer";
  callLink.target = "_blank";

  const callIcon = document.createElement("img");
  callIcon.src = "dialer.png";
  callIcon.alt = "Call";
  callIcon.style.width = "18px";
  callIcon.style.verticalAlign = "middle";

  callLink.appendChild(callIcon);
  callLink.appendChild(document.createTextNode(" Contact Owner"));
  callDiv.appendChild(callLink);
  card.appendChild(callDiv);

  return card;
}
