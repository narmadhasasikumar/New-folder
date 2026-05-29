import { useContext, useState } from "react";
import { createLocation, deleteLocation, generateQr } from "../services/api";
import { LocationContext } from "../context/LocationContext";

const AdminDashboard = () => {
  const { locations, refreshLocations, markRemoved, unmarkRemoved } = useContext(LocationContext);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    floor: 1,
    landmark: "",
    description: "",
    connections: [{ to: "", distance: "", direction: "", accessible: false }],
  });
  const [qrResult, setQrResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnectionChange = (index, field, value) => {
    setForm((prev) => {
      const connections = [...prev.connections];
      connections[index] = { ...connections[index], [field]: value };
      return { ...prev, connections };
    });
  };

  const handleToggleAccessible = (index) => {
    setForm((prev) => {
      const connections = [...prev.connections];
      connections[index] = { ...connections[index], accessible: !connections[index].accessible };
      return { ...prev, connections };
    });
  };

  const handleAddConnection = () => {
    setForm((prev) => ({
      ...prev,
      connections: [...prev.connections, { to: "", distance: "", direction: "", accessible: false }],
    }));
  };

  const handleRemoveConnection = (index) => {
    setForm((prev) => ({
      ...prev,
      connections: prev.connections.filter((_, i) => i !== index),
    }));
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      const connections = (form.connections || [])
        .filter((conn) => conn.to.trim())
        .map((conn) => ({
          to: conn.to.trim(),
          distance: Number(conn.distance) || 0,
          direction: conn.direction.trim(),
          accessible: conn.accessible,
        }));

      await createLocation({ ...form, connections });
      try { unmarkRemoved(form._id); } catch (e) {}
      await refreshLocations();
      setMessage("Location created successfully with connection details.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleGenerateQr = async () => {
    if (!form._id || !form.name) {
      setMessage("Please provide a location ID and name before generating a QR code.");
      return;
    }
    try {
      const data = await generateQr({ locationId: form._id, label: form.name });
      setQrResult(data.qrData);
      setMessage("QR code generated successfully.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm(`Remove location ${id}? This will remove it from the map and all connections.`)) return;
    try {
      await deleteLocation(id);
      try { markRemoved(id); } catch (e) {}
      await refreshLocations();
      setMessage(`Location ${id} removed successfully.`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-8 rounded-3xl bg-white p-6 shadow-lg">
      <div>
        <h2 className="text-2xl font-semibold text-brand-700">Admin Dashboard</h2>
        <p className="mt-2 text-slate-600">Add hospital locations, generate QR codes, and manage route data for the hospital map.</p>
      </div>
      <form onSubmit={handleAddLocation} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Location ID</span>
            <input name="_id" value={form._id} onChange={handleChange} placeholder="RECEPTION_1" required />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Name</span>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Reception" required />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Floor</span>
            <input type="number" name="floor" value={form.floor} onChange={handleChange} />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Landmark</span>
            <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near Reception" />
          </label>
        </div>
        <label className="space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
        </label>
        <label className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Connections</span>
            <button type="button" onClick={handleAddConnection} className="text-sm font-semibold text-brand-700 hover:text-brand-900">+ Add connection</button>
          </div>
          <div className="space-y-3">
            {form.connections.map((connection, index) => (
              <div key={index} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-[2fr_1fr_3fr_auto]">
                <input
                  className="rounded-2xl border border-slate-300 px-3 py-2"
                  placeholder="To location ID"
                  value={connection.to}
                  onChange={(e) => handleConnectionChange(index, "to", e.target.value)}
                />
                <input
                  type="number"
                  className="rounded-2xl border border-slate-300 px-3 py-2"
                  placeholder="Distance"
                  value={connection.distance}
                  onChange={(e) => handleConnectionChange(index, "distance", e.target.value)}
                />
                <input
                  className="rounded-2xl border border-slate-300 px-3 py-2"
                  placeholder="Direction text"
                  value={connection.direction}
                  onChange={(e) => handleConnectionChange(index, "direction", e.target.value)}
                />
                <div className="flex flex-col items-start justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={connection.accessible}
                      onChange={() => handleToggleAccessible(index)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600"
                    />
                    Accessible
                  </label>
                  <button type="button" onClick={() => handleRemoveConnection(index)} className="text-sm font-medium text-red-600 hover:text-red-800">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">Optional: add adjacent route edges so the navigation engine can connect this location to nearby points.</p>
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="rounded-3xl bg-brand-500 px-5 py-3 text-white hover:bg-brand-700">Create Location</button>
          <button type="button" onClick={handleGenerateQr} className="rounded-3xl bg-slate-700 px-5 py-3 text-white hover:bg-slate-800">Generate QR Code</button>
        </div>
      </form>
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Existing locations</h3>
            <p className="text-sm text-slate-600">Remove a ward or location from the admin list.</p>
          </div>
        </div>
        {locations.length === 0 ? (
          <p className="text-sm text-slate-500">No locations available yet.</p>
        ) : (
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location._id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{location.name || location._id}</p>
                  <p className="text-sm text-slate-500">{location._id} · Floor {location.floor || "N/A"} · {location.landmark || "No landmark"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteLocation(location._id)}
                  className="inline-flex items-center justify-center rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {message && <p className="rounded-3xl bg-brand-50 p-4 text-sm text-brand-700">{message}</p>}
          {qrResult && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold">QR Code Generated</h3>
              <img className="mt-4 max-w-[240px]" src={qrResult} alt="Generated QR code" />
              <p className="mt-3 text-sm text-slate-600">Use this QR code at the corresponding location marker.</p>
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold">Direction guidance</h3>
          <p className="mt-3 text-slate-600">To make directions clear, fill these fields with route-friendly details.</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            <li>Use a unique <strong>Location ID</strong> and friendly <strong>Name</strong>.</li>
            <li>Include the <strong>Floor</strong> and a visible <strong>Landmark</strong> for better wayfinding.</li>
            <li>Write a short <strong>Description</strong> that explains where the location is located.</li>
            <li>If available, add <strong>connections</strong> to nearby locations as JSON so the route engine can build paths.</li>
            <li>Connections should include <strong>to</strong>, <strong>distance</strong>, and <strong>direction</strong>.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-500">Example:</p>
          <pre className="mt-2 rounded-3xl border border-slate-200 bg-slate-900 p-4 text-xs text-slate-100">
            {`[{"to":"Reception","distance":10,"direction":"Walk straight ahead to the reception desk","accessible":true}]`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
