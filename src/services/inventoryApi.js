const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const inventoryApi = {
  getAll: () =>
    fetch(`${BASE_URL}/inventory`).then(handleResponse),

  getById: (id) =>
    fetch(`${BASE_URL}/inventory/${id}`).then(handleResponse),

  create: (formData) =>
    fetch(`${BASE_URL}/register`, {
      method: "POST",
      body: formData,
    }).then(handleResponse),

  updateInfo: (id, { inventory_name, description }) =>
    fetch(`${BASE_URL}/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventory_name, description }),
    }).then(handleResponse),

  updatePhoto: (id, formData) =>
    fetch(`${BASE_URL}/inventory/${id}/photo`, {
      method: "PUT",
      body: formData,
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/inventory/${id}`, {
      method: "DELETE",
    }).then(handleResponse),

  photoUrl: (id) => `${BASE_URL}/inventory/${id}/photo`,
};
