const BASE_URL = import.meta.env.DEV ? "/api" : "/api";

export const fetchLocations = async () => {
  const response = await fetch(`${BASE_URL}/locations`);
  if (!response.ok) throw new Error("Failed to load locations");
  return response.json();
};

export const fetchRoute = async ({ from, to, wheelchair = false, emergency = true }) => {
  const query = new URLSearchParams({ from, to, wheelchair, emergency }).toString();
  const response = await fetch(`${BASE_URL}/route?${query}`);
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || "Unable to compute route");
  }
  return response.json();
};

export const generateQr = async (payload) => {
  const response = await fetch(`${BASE_URL}/admin/qr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to generate QR code");
  return response.json();
};

export const createLocation = async (location) => {
  const response = await fetch(`${BASE_URL}/admin/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });
  if (!response.ok) throw new Error("Failed to create location");
  return response.json();
};

export const updateLocation = async (id, location) => {
  const response = await fetch(`${BASE_URL}/admin/location/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });
  if (!response.ok) throw new Error("Failed to update location");
  return response.json();
};

export const deleteLocation = async (id) => {
  const response = await fetch(`${BASE_URL}/admin/location/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to remove location");
  }
  return response.json();
};
