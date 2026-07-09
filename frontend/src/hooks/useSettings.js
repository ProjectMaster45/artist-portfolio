// hooks/useSettings.js
// Fetch and cache website settings globally

import { useState, useEffect } from "react";
import { settingsAPI } from "../services/api";

// Simple module-level cache to avoid refetching on every mount
let cachedSettings = null;
let fetchPromise = null;

export const useSettings = () => {
  const [settings, setSettings] = useState(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = settingsAPI.get()
        .then((res) => {
          cachedSettings = res.data.settings;
          return cachedSettings;
        })
        .catch(() => null)
        .finally(() => { fetchPromise = null; });
    }

    fetchPromise.then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  // Force a refresh (call after updating settings in admin)
  const refreshSettings = () => {
    cachedSettings = null;
    setLoading(true);
    settingsAPI.get().then((res) => {
      cachedSettings = res.data.settings;
      setSettings(cachedSettings);
      setLoading(false);
    });
  };

  return { settings, loading, refreshSettings };
};

export const setCachedSettings = (newSettings) => {
  cachedSettings = newSettings;
};
