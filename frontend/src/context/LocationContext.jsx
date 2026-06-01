import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { fetchLocations } from "../services/api";
import { WARDS } from "../data/HospitalMap";

export const LocationContext = createContext({
  locations: [],
  loading: true,
  error: "",
  refreshLocations: async () => {},
});

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState(
    WARDS.map((w) => ({ _id: w, name: w, landmark: "", floor: 1 }))
  );
  const STORAGE_KEY = "removedLocations";
  const [removedIds, setRemovedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLocations();
      const existingIds = new Set(data.map((d) => d._id || d.name));
      const merged = [...data];
      WARDS.forEach((w) => {
        if (!existingIds.has(w)) {
          merged.push({ _id: w, name: w, landmark: "", floor: 1 });
        }
      });
      // filter out any ids that were removed by admin
      const filtered = merged.filter((loc) => !removedIds.includes(loc._id));
      setLocations(filtered);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load locations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const markRemoved = useCallback((id) => {
    setRemovedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const unmarkRemoved = useCallback((id) => {
    setRemovedIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = prev.filter((x) => x !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  useEffect(() => {
    // reload when removedIds change
    loadLocations();
  }, [loadLocations, removedIds]);

  const value = useMemo(
    () => ({ locations, loading, error, refreshLocations: loadLocations, markRemoved, unmarkRemoved }),
    [locations, loading, error, loadLocations, markRemoved, unmarkRemoved]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
