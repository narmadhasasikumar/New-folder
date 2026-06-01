import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRoute } from "../services/api";

const NavigationResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoute = async () => {
      if (!state?.from || !state?.to) {
        return;
      }
      setLoading(true);
      try {
        const data = await fetchRoute({ from: state.from, to: state.to, wheelchair: false, emergency: true });
        setRoute(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRoute();
  }, [state]);

  if (!state?.from || !state?.to) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-brand-700">No route selected</h2>
        <p className="mt-3 text-slate-600">Please start from the home page or scanner to choose a valid route.</p>
        <button
          type="button"
          className="mt-6 btn-primary"
          onClick={() => navigate('/')}
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-3xl bg-white p-6 shadow-lg">
      <div>
        <h2 className="text-2xl font-semibold text-brand-700">Navigation Result</h2>
        <p className="mt-2 text-slate-600">Step-by-step directions from your current location to your selected ward.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-semibold">From</h3>
          <p className="mt-2 text-slate-700">{state.from}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-semibold">To</h3>
          <p className="mt-2 text-slate-700">{state.to}</p>
        </div>
      </div>
      {loading && <p className="text-slate-500">Calculating the shortest path...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {route && (() => {
        // normalize route fields to support different backend shapes
        const distanceRaw = route.distance ?? route.totalDistance ?? null;
        const distanceText = typeof distanceRaw === 'number' ? `${distanceRaw} meters` : distanceRaw ?? 'Unknown';

        const timeRaw = route.time ?? (() => {
          if (typeof distanceRaw === 'number') {
            // assume avg walking speed ~60 meters/min
            return Math.max(1, Math.round(distanceRaw / 60));
          }
          return null;
        })();
        const timeText = typeof timeRaw === 'number' ? `${timeRaw} mins` : timeRaw ?? 'Unknown';

        const stepsRaw = route.steps || [];
        const steps = stepsRaw.map((s, i) => {
          // s may be {from,to,direction} or already normalized
          return {
            step: s.step ?? i + 1,
            direction: s.direction ?? (s.from && s.to ? `${s.from} → ${s.to}` : String(s)),
            landmark: s.landmark ?? s.landmark ?? '',
            floor: s.floor ?? s.floor ?? '',
          };
        });

        const pathItems = (route.path || []).map((p) => (p && p.name) ? p.name : String(p));

        return (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-brand-50 p-6">
            <h3 className="text-xl font-semibold">Route summary</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-500">Distance</p>
                <p className="mt-2 text-lg font-semibold">{distanceText}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-500">Estimated time</p>
                <p className="mt-2 text-lg font-semibold">{timeText}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold">Directions</h3>
            <div className="mt-4 space-y-4">
              {steps.map((step) => (
                <div key={`step-${step.step}-${step.direction}`} className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="font-semibold">Step {step.step}</p>
                  <p className="mt-2 text-slate-700">{step.direction}</p>
                  <p className="mt-2 text-sm text-slate-500">Landmark: {step.landmark || '—'} · Floor {step.floor || '—'}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold">Path map</h3>
            <p className="mt-3 text-slate-600">{pathItems.join(" → ")}</p>
          </div>
        </div>
        );
      })()}
    </div>
  );
};

export default NavigationResultPage;
