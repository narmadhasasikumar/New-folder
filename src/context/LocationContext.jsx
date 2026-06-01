import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { fetchLocations } from "../services/api";
import { WARDS } from "../data/HospitalMap";

export const LocationContext = createContext({
  locations: [],
  loading: true,
  error: "",
  refreshLocations: async () => {},
  addLocation: async () => {},
  markRemoved: () => {},
  unmarkRemoved: () => {},
});

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState(
    WARDS.map((w) => ({ _id: w, name: w, landmark: "", floor: 1 }))
  );
  const REMOVED_STORAGE_KEY = "removedLocations";
  const ADDED_STORAGE_KEY = "addedLocations";

  const [removedIds, setRemovedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(REMOVED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [addedLocations, setAddedLocations] = useState(() => {
    try {
      const raw = localStorage.getItem(ADDED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const saveAddedLocations = (next) => {
    try {
      localStorage.setItem(ADDED_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    return next;
  };

  const saveRemovedIds = (next) => {
    try {
      localStorage.setItem(REMOVED_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    return next;
  };

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

      addedLocations.forEach((loc) => {
        if (!existingIds.has(loc._id) && !removedIds.includes(loc._id)) {
          merged.push(loc);
        }
      });

      const filtered = merged.filter((loc) => !removedIds.includes(loc._id));
      setLocations(filtered);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load locations.");
    } finally {
      setLoading(false);
    }
  }, [addedLocations, removedIds]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const addLocation = useCallback((location) => {
    setAddedLocations((prev) => {
      if (prev.some((item) => item._id === location._id)) return prev;
      const next = saveAddedLocations([...prev, location]);
      return next;
    });
  }, []);

  const removeAddedLocation = useCallback((id) => {
    setAddedLocations((prev) => {
      const next = prev.filter((item) => item._id !== id);
      return saveAddedLocations(next);
    });
  }, []);

  const markRemoved = useCallback(
    (id) => {
      setRemovedIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = saveRemovedIds([...prev, id]);
        removeAddedLocation(id);
        return next;
      });
    },
    [removeAddedLocation]
  );

  const unmarkRemoved = useCallback((id) => {
    setRemovedIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = saveRemovedIds(prev.filter((x) => x !== id));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      locations,
      loading,
      error,
      refreshLocations: loadLocations,
      addLocation,
      markRemoved,
      unmarkRemoved,
    }),
    [locations, loading, error, loadLocations, addLocation, markRemoved, unmarkRemoved]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
