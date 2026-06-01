import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { LocationContext } from "../context/LocationContext";

const ScannerPage = () => {
  const [from, setFrom] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const { locations, loading } = useContext(LocationContext);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { qrbox: { width: 280, height: 280 }, fps: 10 });

    scanner.render(
      async (result) => {
        try {
          const payload = JSON.parse(result);
          if (!payload.locationId) {
            throw new Error("Invalid QR payload");
          }
          const matched = locations.find((item) => item._id === payload.locationId);
          if (!matched) {
            setError("QR code location not recognized in the hospital map.");
            return;
          }
          setFrom(matched._id);
          setManualLocation(matched.name);
          setError("");
          scanner.clear();
        } catch (err) {
          setError(err.message || "Unable to parse QR code.");
        }
      },
      (err) => {
        console.warn("QR error", err);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [locations]);

  const handleManualLocation = () => {
    const selected = locations.find(
      (item) =>
        item._id.toLowerCase() === manualLocation.trim().toLowerCase() ||
        item.name.toLowerCase() === manualLocation.trim().toLowerCase()
    );
    if (!selected) {
      setError("Please enter a valid location name from the hospital map.");
      return;
    }
    setFrom(selected._id);
    setManualLocation(selected.name);
    setError("");
  };

  const handleContinue = () => {
    if (!from || !to) {
      setError("Please select a destination after scanning your location.");
      return;
    }
    navigate("/result", { state: { from, to } });
  };

  return (
    <div className="space-y-8 rounded-3xl bg-white p-6 shadow-lg">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-brand-700">QR Scanner</h2>
        <p className="text-slate-600">Position your phone camera to scan the wall QR code or enter your location manually.</p>
      </div>
      <div id="reader" className="h-[400px] rounded-3xl border border-slate-200 bg-slate-50"></div>

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="space-y-3">
          <h3 className="font-semibold">Manual location input</h3>
          <p className="text-sm text-slate-600">If camera access is unavailable, type your current location name and confirm.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
            >
              <option value="">Choose current location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>{loc.name}</option>
              ))}
            </select>
            <button type="button" onClick={handleManualLocation} className="btn-secondary">
              Use location
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Current location detected</h3>
          <p className="mt-2 text-slate-700">{from || "Waiting for QR scan..."}</p>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Select destination</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={!from}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
          >
            <option value="">Choose destination</option>
            {locations
              .filter((location) => location._id !== from)
              .map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
          </select>
        </div>
        <button
          disabled={!from || !to}
          onClick={handleContinue}
          className="rounded-3xl bg-brand-500 px-6 py-3 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Continue to navigation
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default ScannerPage;
