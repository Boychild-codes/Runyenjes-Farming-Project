// ——— Data with your actual images ———
const PRODUCE = [
  { 
    name: "Hass Avocados", 
    desc: "Export-grade and local market quality. Consistent supply from Embu highlands.",
    image: "Images/Hass Avocado.png"
  },
  { 
    name: "Macadamia", 
    desc: "Dried and sorted nuts. Ready for processors, exporters and retailers.",
    image: "Images/Macadamia.png"
  },
  { 
    name: "Mangoes", 
    desc: "Seasonal varieties including Apple, Tommy and local types.",
    image: "Images/Mango.png"
  },
  { 
    name: "Bananas", 
    desc: "Highland bananas (irigu) — fresh hands and bunches.",
    image: "Images/Banana2.png"
  },
  { 
    name: "Coffee", 
    desc: "Arabica coffee from Embu. Cherry or parchment depending on season.",
    image: "Images/Coffee.png"
  },
  { 
    name: "Cassava", 
    desc: "Fresh roots and processed options on request.",
    image: "Images/Cassava.png"
  },
  { 
    name: "Muguka", 
    desc: "Quality muguka sourced from Embu growing areas.",
    image: "Images/Muguka.png"
  }
];

const SEEDLINGS = [
  { 
    name: "Hass Avocado seedlings", 
    desc: "Healthy, ready-to-plant grafted seedlings.",
    image: "Images/Hass Seedlings.png"
  },
  { 
    name: "Macadamia seedlings", 
    desc: "Strong planting material for new orchards.",
    image: "Images/Macadamia Seedling.png"
  },
  { 
    name: "Mango seedlings", 
    desc: "Popular commercial varieties.",
    image: "Images/Mango Seedling.png"
  },
  { 
    name: "Banana seedlings", 
    desc: "Tissue culture and traditional suckers available.",
    image: "Images/Banana-seedling.png"
  },
  { 
    name: "Coffee seedlings", 
    desc: "Ruiru 11 and other recommended varieties.",
    image: "Images/Coffee Seedling.png"
  },
  { 
    name: "Muguka seedlings", 
    desc: "High-demand planting material.",
    image: "Images/Muguka Seedling.png"
  },
  { 
    name: "Flower seedlings", 
    desc: "Assorted varieties for nurseries and landscapers.",
    image: "Images/Flower seedling.png"
  }
];

const DELIVERY_AREAS = [
  { area: "Nairobi & Surrounds", time: "1–2 days", note: "Most frequent route" },
  { area: "Central Kenya", time: "1–2 days", note: "Nyeri, Murang’a, Kiambu, Kirinyaga" },
  { area: "Rift Valley", time: "2–3 days", note: "Nakuru, Eldoret, Naivasha, Kericho" },
  { area: "Western & Nyanza", time: "2–4 days", note: "Kisumu, Kakamega, Kisii, Bungoma" },
  { area: "Coast Region", time: "3–5 days", note: "Mombasa, Malindi, Kilifi, Kwale" },
  { area: "Eastern & Northern", time: "2–4 days", note: "Meru, Machakos, Isiolo, Garissa" }
];

// ——— Navigation ———
document.getElementById("nav").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const id = e.target.dataset.panel;
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
});

// ——— Product Tabs ———
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    document.getElementById("produce-grid").style.display = target === "produce" ? "grid" : "none";
    document.getElementById("seedlings-grid").style.display = target === "seedlings" ? "grid" : "none";
  });
});

// ——— Render Products with Images ———
function renderProducts(list, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
      </div>
    </div>
  `).join("");
}

renderProducts(PRODUCE, "produce-grid");
renderProducts(SEEDLINGS, "seedlings-grid");

// ——— Transport Calculator ———
const RATE_PER_100KM = 2000;

function updateTransport() {
  const km = parseFloat(document.getElementById("o-distance").value) || 0;
  const cost = Math.ceil(km / 100) * RATE_PER_100KM;
  document.getElementById("transport-cost").textContent = 
    "KSh " + cost.toLocaleString("en-KE");
}

document.getElementById("o-distance").addEventListener("input", updateTransport);

// ——— Order Form ———
document.getElementById("order-btn").addEventListener("click", () => {
  const name = document.getElementById("o-name").value.trim();
  const phone = document.getElementById("o-phone").value.trim();
  const product = document.getElementById("o-product").value;
  const qty = document.getElementById("o-qty").value.trim();
  const location = document.getElementById("o-location").value.trim();
  const distance = document.getElementById("o-distance").value;
  const notes = document.getElementById("o-notes").value.trim();

  if (!name || !phone || !qty || !location) {
    alert("Please fill in all required fields (Name, Phone, Quantity and Location).");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("rh_orders") || "[]");
  orders.unshift({
    date: new Date().toLocaleString("en-KE"),
    name, phone, product, qty, location, distance, notes
  });
  localStorage.setItem("rh_orders", JSON.stringify(orders));

  document.getElementById("order-success").style.display = "block";
  
  ["o-name", "o-phone", "o-qty", "o-location", "o-distance", "o-notes"].forEach(id => {
    document.getElementById(id).value = "";
  });
  updateTransport();

  setTimeout(() => {
    document.getElementById("order-success").style.display = "none";
  }, 6000);
});

// ——— Delivery Areas ———
const deliveryGrid = document.getElementById("delivery-grid");
DELIVERY_AREAS.forEach(d => {
  const el = document.createElement("div");
  el.className = "delivery-card";
  el.innerHTML = `
    <h3>${d.area}</h3>
    <p><strong>${d.time}</strong><br>${d.note}</p>
  `;
  deliveryGrid.appendChild(el);
});