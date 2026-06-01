import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SparklesIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LanguageContext } from "../context/LanguageContext";
import { LocationContext } from "../context/LocationContext";

const frequentDestinations = [
  { id: "Pharmacy", name: "Pharmacy" },
  { id: "Reception", name: "Reception" },
  { id: "EMD", name: "Emergency Ward" },
  { id: "Radiology", name: "Radiology" },
];

const HomePage = () => {
  const [fromText, setFromText] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { locations, loading, error: locationError, refreshLocations } = useContext(LocationContext);

  const suggestions = useMemo(() => {
    if (!searchText) return locations;
    const lower = searchText.toLowerCase();
    return locations.filter((item) => item.name.toLowerCase().includes(lower));
  }, [locations, searchText]);

  const fromSuggestions = useMemo(() => {
    if (!fromText) return locations.slice(0, 6);
    const lower = fromText.toLowerCase();
    return locations.filter(
      (item) => item.name.toLowerCase().includes(lower) || item._id.toLowerCase().includes(lower)
    );
  }, [locations, fromText]);

  const { strings } = useContext(LanguageContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedFrom = locations.find(
      (item) => item._id === from || item.name.toLowerCase() === fromText.trim().toLowerCase()
    );
    if (!selectedFrom) {
      setError("Please select a valid start location from the hospital map.");
      return;
    }
    if (!to) {
      setError("Please select a destination before continuing.");
      return;
    }
    setError("");
    navigate("/result", { state: { from: selectedFrom._id, to } });
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-6">
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 p-8 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Hospital Wayfinding</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Find the fastest route inside PSG Hospitals</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">Scan QR codes, choose your destination, and get clear step-by-step directions with floor and landmark support.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-4">
              <SparklesIcon className="h-6 w-6 text-white" />
              <p className="mt-3 text-sm font-semibold">Easy navigation</p>
              <p className="mt-2 text-sm text-slate-200">Smart route guidance for patients and visitors.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <MapPinIcon className="h-6 w-6 text-white" />
              <p className="mt-3 text-sm font-semibold">Location-aware</p>
              <p className="mt-2 text-sm text-slate-200">Scan QR signs to auto-detect your current location.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <ClockIcon className="h-6 w-6 text-white" />
              <p className="mt-3 text-sm font-semibold">Fast results</p>
              <p className="mt-2 text-sm text-slate-200">Shortest path planning for quick hospital travel.</p>
            </div>
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-semibold text-brand-700">Plan your visit</h3>
            <p className="mt-3 text-slate-600">Use the quick controls below to choose where you are and where you want to go.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Current status</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{from ? `Start: ${fromText}` : "Start not selected"}</p>
                <div className="mt-3">
                  <label className="block text-sm text-slate-500">Choose current location</label>
                  <select
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
                    value={from}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFrom(val);
                      const sel = locations.find((l) => l._id === val);
                      setFromText(sel ? sel.name : "");
                      setError("");
                    }}
                  >
                    <option value="">Select current location</option>
                    {locations.map((loc) => (
                      <option key={loc._id} value={loc._id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Destination</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{to ? to : "Not selected yet"}</p>
                <div className="mt-3">
                  <label className="block text-sm text-slate-500">Choose destination</label>
                  <select
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
                    value={to}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTo(val);
                      const sel = locations.find((l) => l._id === val);
                      setSearchText(sel ? sel.name : "");
                    }}
                  >
                    <option value="">Select destination</option>
                    {locations.map((loc) => (
                      <option key={loc._id} value={loc._id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-2 rounded-3xl bg-brand-500 px-6 py-3 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!from || !to}
              >
                {strings.findRoute}
              </button>
              <button type="button" className="btn-primary" onClick={() => navigate("/scanner")}>Open QR scanner</button>
              <button type="button" className="btn-secondary" onClick={() => navigate("/admin")}>Open admin panel</button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Removed Current Location and Destination panels as requested */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold">Quick actions</h3>
          <p className="mt-3 text-slate-500">Scan QR from walls or corridor codes to automatically detect the current location.</p>
          <div className="mt-6 space-y-3">
            <a href="/scanner" className="block rounded-2xl bg-brand-500 px-5 py-4 text-white transition hover:bg-brand-700">Open QR Scanner</a>
            <a href="/admin" className="block rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 transition hover:border-brand-500">Open Admin Panel</a>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold">How it works</h3>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-600">
            <li>Scan the QR code on hospital walls or use the scanner page.</li>
            <li>Select where you want to go.</li>
            <li>Get step-by-step directions with landmarks and floor details.</li>
          </ol>
        </div>
      </div>
      {loading && <p className="text-slate-500">Loading hospital locations...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </section>
  );
};

export default HomePage;
