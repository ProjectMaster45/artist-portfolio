import { useEffect } from "react";
import { buildThemeFromSettings } from "../themePresets";

const mixHex = (hex, amount) => {
  const clean = String(hex || "").replace("#", "");
  if (clean.length !== 6) return hex;

  const target = amount > 0 ? 255 : 0;
  const ratio = Math.abs(amount);
  const channels = [0, 2, 4].map((start) => parseInt(clean.slice(start, start + 2), 16));
  const mixed = channels.map((channel) =>
    Math.round(channel + (target - channel) * ratio).toString(16).padStart(2, "0")
  );

  return `#${mixed.join("")}`;
};

const hexToRgb = (hex, fallback = "0 0 0") => {
  const clean = String(hex || "").replace("#", "");
  if (clean.length !== 6) return fallback;

  return [0, 2, 4].map((start) => parseInt(clean.slice(start, start + 2), 16)).join(" ");
};

const isVeryLightHex = (hex) => {
  const clean = String(hex || "").replace("#", "");
  if (clean.length !== 6) return false;

  return getLuminance(hex) > 0.86;
};

const getLuminance = (hex) => {
  const clean = String(hex || "").replace("#", "");
  if (clean.length !== 6) return 1;

  const [r, g, b] = [0, 2, 4].map((start) => {
    const value = parseInt(clean.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (first, second) => {
  const lighter = Math.max(getLuminance(first), getLuminance(second));
  const darker = Math.min(getLuminance(first), getLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
};

const getReadableTextColor = (textColor, backgroundColor) => {
  if (getContrastRatio(textColor, backgroundColor) >= 4.5) {
    return textColor;
  }

  return getLuminance(backgroundColor) > 0.45 ? "#1C1C1E" : "#F8F5F0";
};

export const applyWebsiteTheme = (settings) => {
  const theme = buildThemeFromSettings(settings);
  const root = document.documentElement;
  const accentLight = mixHex(theme.accentColor, 0.22);
  const accentDark = mixHex(theme.accentColor, -0.25);
  const primaryColor = isVeryLightHex(theme.primaryColor) ? "#1C1C1E" : theme.primaryColor;
  const textColor = getReadableTextColor(theme.textColor, theme.backgroundColor);
  const mutedTextColor = getReadableTextColor(theme.mutedTextColor, theme.backgroundColor);

  root.style.setProperty("--theme-primary", primaryColor);
  root.style.setProperty("--theme-secondary", theme.secondaryColor);
  root.style.setProperty("--theme-accent", theme.accentColor);
  root.style.setProperty("--theme-accent-light", accentLight);
  root.style.setProperty("--theme-accent-dark", accentDark);
  root.style.setProperty("--theme-bg", theme.backgroundColor);
  root.style.setProperty("--theme-surface", theme.surfaceColor);
  root.style.setProperty("--theme-text", textColor);
  root.style.setProperty("--theme-muted", mutedTextColor);
  root.style.setProperty("--theme-border", theme.borderColor);
  root.style.setProperty("--theme-primary-rgb", hexToRgb(primaryColor, "28 28 30"));
  root.style.setProperty("--theme-secondary-rgb", hexToRgb(theme.secondaryColor, "248 245 240"));
  root.style.setProperty("--theme-accent-rgb", hexToRgb(theme.accentColor, "201 168 76"));
  root.style.setProperty("--theme-accent-light-rgb", hexToRgb(accentLight, "222 192 110"));
  root.style.setProperty("--theme-accent-dark-rgb", hexToRgb(accentDark, "160 122 40"));
  root.style.setProperty("--theme-bg-rgb", hexToRgb(theme.backgroundColor, "248 245 240"));
  root.style.setProperty("--theme-surface-rgb", hexToRgb(theme.surfaceColor, "255 255 255"));
  root.style.setProperty("--theme-text-rgb", hexToRgb(textColor, "28 28 30"));
  root.style.setProperty("--theme-muted-rgb", hexToRgb(mutedTextColor, "74 74 90"));
  root.style.setProperty("--theme-border-rgb", hexToRgb(theme.borderColor, "232 232 232"));
  root.style.setProperty("--theme-button-radius", theme.buttonRadius || "0px");
  root.style.setProperty("--theme-card-radius", theme.cardRadius || "0px");
  root.dataset.themeMode = theme.themeMode || "light";
};

export const useWebsiteTheme = (settings) => {
  useEffect(() => {
    applyWebsiteTheme(settings);
  }, [settings]);
};
