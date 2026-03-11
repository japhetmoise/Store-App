const statusNode = () => document.getElementById("status-message");
let productsCache = [];

function showStatus(message, type = "ok") {
  const node = statusNode();
  if (!node) return;

  node.textContent = message;
  node.classList.remove("ok", "error");
  node.classList.add(type);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function productNameById(productId) {
  const product = productsCache.find((row) => Number(row.product_id) === Number(productId));
  if (!product) return `#${productId}`;
  return product.name;
}

function populateProductSelects() {
  const options = [
    '<option value="">Select product</option>',
    ...productsCache.map((product) => `<option value="${product.product_id}">${escapeHtml(product.name)}</option>`),
  ].join("");

  storeIns.productId().innerHTML = options;
  storeOuts.productId().innerHTML = options;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody.error || (errorBody.errors && errorBody.errors.join(", ")) || `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

const products = {
  body: () => document.getElementById("products-body"),
  form: () => document.getElementById("product-form"),
  editId: () => document.getElementById("product-edit-id"),
  name: () => document.getElementById("product-name"),
  price: () => document.getElementById("product-price"),
};

const storeIns = {
  body: () => document.getElementById("store-ins-body"),
  form: () => document.getElementById("store-in-form"),
  editId: () => document.getElementById("store-in-edit-id"),
  productId: () => document.getElementById("store-in-product-id"),
  quantity: () => document.getElementById("store-in-quantity"),
  date: () => document.getElementById("store-in-date"),
};

const storeOuts = {
  body: () => document.getElementById("store-outs-body"),
  form: () => document.getElementById("store-out-form"),
  editId: () => document.getElementById("store-out-edit-id"),
  productId: () => document.getElementById("store-out-product-id"),
  quantity: () => document.getElementById("store-out-quantity"),
  date: () => document.getElementById("store-out-date"),
};

function resetProductForm() {
  products.editId().value = "";
  products.form().reset();
}

function resetStoreInForm() {
  storeIns.editId().value = "";
  storeIns.form().reset();
}

function resetStoreOutForm() {
  storeOuts.editId().value = "";
  storeOuts.form().reset();
}

async function loadProducts() {
  const rows = await apiRequest("/api/products");
  productsCache = rows;
  products.body().innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.product_id}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${row.price}</td>
        <td class="row-actions">
          <button type="button" class="btn tiny" data-action="edit-product" data-id="${row.product_id}" data-name="${escapeHtml(row.name)}" data-price="${row.price}">Edit</button>
          <button type="button" class="btn tiny danger" data-action="delete-product" data-id="${row.product_id}">Delete</button>
        </td>
      </tr>
    `)
    .join("");

  populateProductSelects();
}

async function loadStoreIns() {
  const rows = await apiRequest("/api/store_ins");
  storeIns.body().innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.id}</td>
        <td>${escapeHtml(productNameById(row.product_id))}</td>
        <td>${row.quantity}</td>
        <td>${row.date}</td>
        <td class="row-actions">
          <button type="button" class="btn tiny" data-action="edit-store-in" data-id="${row.id}" data-product-id="${row.product_id}" data-quantity="${row.quantity}" data-date="${row.date}">Edit</button>
          <button type="button" class="btn tiny danger" data-action="delete-store-in" data-id="${row.id}">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

async function loadStoreOuts() {
  const rows = await apiRequest("/api/store_outs");
  storeOuts.body().innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.id}</td>
        <td>${escapeHtml(productNameById(row.product_id))}</td>
        <td>${row.quantity}</td>
        <td>${row.date}</td>
        <td class="row-actions">
          <button type="button" class="btn tiny" data-action="edit-store-out" data-id="${row.id}" data-product-id="${row.product_id}" data-quantity="${row.quantity}" data-date="${row.date}">Edit</button>
          <button type="button" class="btn tiny danger" data-action="delete-store-out" data-id="${row.id}">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

async function refreshAll() {
  await loadProducts();
  await Promise.all([loadStoreIns(), loadStoreOuts()]);
}

async function onProductSubmit(event) {
  event.preventDefault();

  const id = products.editId().value;
  const payload = {
    product: {
      name: products.name().value,
      price: Number(products.price().value),
    },
  };

  if (id) {
    await apiRequest(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    showStatus("Product updated.");
  } else {
    await apiRequest("/api/products", { method: "POST", body: JSON.stringify(payload) });
    showStatus("Product created.");
  }

  resetProductForm();
  await refreshAll();
}

async function onStoreInSubmit(event) {
  event.preventDefault();

  const id = storeIns.editId().value;
  const payload = {
    store_in: {
      product_id: Number(storeIns.productId().value),
      quantity: Number(storeIns.quantity().value),
      date: storeIns.date().value,
    },
  };

  if (id) {
    await apiRequest(`/api/store_ins/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    showStatus("Store In record updated.");
  } else {
    await apiRequest("/api/store_ins", { method: "POST", body: JSON.stringify(payload) });
    showStatus("Store In record created.");
  }

  resetStoreInForm();
  await loadStoreIns();
}

async function onStoreOutSubmit(event) {
  event.preventDefault();

  const id = storeOuts.editId().value;
  const payload = {
    store_out: {
      product_id: Number(storeOuts.productId().value),
      quantity: Number(storeOuts.quantity().value),
      date: storeOuts.date().value,
    },
  };

  if (id) {
    await apiRequest(`/api/store_outs/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    showStatus("Store Out record updated.");
  } else {
    await apiRequest("/api/store_outs", { method: "POST", body: JSON.stringify(payload) });
    showStatus("Store Out record created.");
  }

  resetStoreOutForm();
  await loadStoreOuts();
}

function attachTableActions() {
  document.body.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    if (!action) return;

    try {
      if (action === "edit-product") {
        products.editId().value = target.dataset.id || "";
        products.name().value = target.dataset.name || "";
        products.price().value = target.dataset.price || "";
      }

      if (action === "delete-product") {
        await apiRequest(`/api/products/${target.dataset.id}`, { method: "DELETE" });
        showStatus("Product deleted.");
        await refreshAll();
      }

      if (action === "edit-store-in") {
        storeIns.editId().value = target.dataset.id || "";
        storeIns.productId().value = target.dataset.productId || "";
        storeIns.quantity().value = target.dataset.quantity || "";
        storeIns.date().value = target.dataset.date || "";
      }

      if (action === "delete-store-in") {
        await apiRequest(`/api/store_ins/${target.dataset.id}`, { method: "DELETE" });
        showStatus("Store In record deleted.");
        await loadStoreIns();
      }

      if (action === "edit-store-out") {
        storeOuts.editId().value = target.dataset.id || "";
        storeOuts.productId().value = target.dataset.productId || "";
        storeOuts.quantity().value = target.dataset.quantity || "";
        storeOuts.date().value = target.dataset.date || "";
      }

      if (action === "delete-store-out") {
        await apiRequest(`/api/store_outs/${target.dataset.id}`, { method: "DELETE" });
        showStatus("Store Out record deleted.");
        await loadStoreOuts();
      }
    } catch (error) {
      showStatus(error.message, "error");
    }
  });
}

function bindEvents() {
  products.form().addEventListener("submit", (event) => onProductSubmit(event).catch((error) => showStatus(error.message, "error")));
  storeIns.form().addEventListener("submit", (event) => onStoreInSubmit(event).catch((error) => showStatus(error.message, "error")));
  storeOuts.form().addEventListener("submit", (event) => onStoreOutSubmit(event).catch((error) => showStatus(error.message, "error")));

  document.getElementById("cancel-product-edit").addEventListener("click", resetProductForm);
  document.getElementById("cancel-store-in-edit").addEventListener("click", resetStoreInForm);
  document.getElementById("cancel-store-out-edit").addEventListener("click", resetStoreOutForm);

  document.getElementById("refresh-products").addEventListener("click", () => loadProducts().catch((error) => showStatus(error.message, "error")));
  document.getElementById("refresh-store-ins").addEventListener("click", () => loadStoreIns().catch((error) => showStatus(error.message, "error")));
  document.getElementById("refresh-store-outs").addEventListener("click", () => loadStoreOuts().catch((error) => showStatus(error.message, "error")));
}

async function initStoreFrontend() {
  const root = document.querySelector(".dashboard");
  if (!root || root.dataset.initialized === "true") return;

  root.dataset.initialized = "true";
  attachTableActions();
  bindEvents();

  try {
    await refreshAll();
    showStatus("Data loaded.");
  } catch (error) {
    showStatus(error.message, "error");
  }
}

document.addEventListener("turbo:load", initStoreFrontend);
