// Brand colors extracted from app logo
// Sunset gradient: coral → orange → golden yellow
// Water: light blue → deep blue

export const Colors = {
  // Sunset gradient colors (top of logo)
  sunsetStart: "#FF5F45", // Coral red-orange
  sunsetMid: "#FF8C42", // Warm orange
  sunsetEnd: "#FFB347", // Golden yellow
  sunsetGlow: "#FFECD2", // Light glow at horizon

  // Water/wave colors (bottom of logo)
  waterLight: "#6BB3D9", // Light blue
  waterMid: "#4A90D9", // Medium blue
  waterDeep: "#2E5A88", // Deep blue
  waterDark: "#1A3A5C", // Darkest blue

  // App colors derived from brand
  // background: "#0F2744", // Deep night blue (darker than water)
  // surface: "#1A3A5C", // Water dark blue
  // surfaceLight: "#2E5A88", // Water deep blue
  background: "#151515", // Deep dark gray
  surface: "#2A2A2A", // Dark gray
  surfaceLight: "#404040", // Medium gray

  primary: "#FF6B4A", // Main coral/orange
  primaryLight: "#FF8C42", // Lighter orange
  primaryMuted: "#FF6B4A60", // Transparent coral

  secondary: "#4A90D9", // Water blue
  secondaryMuted: "#4A90D980", // Transparent blue

  text: "#FFFFFF", // White (like timer marks)
  textMuted: "#A8C5D9", // Muted blue-white
  textDark: "#6B8BA3", // Darker muted text

  accent: "#FFB347", // Golden yellow
  success: "#6BB3D9", // Light water blue
  warning: "#FF8C42", // Orange
  overtime: "#FF5F45", // Coral for overtime indicator
};

// Gradient definitions for use with expo-linear-gradient
export const Gradients = {
  sunset: ["#FF5F45", "#FF8C42", "#FFB347", "#FFECD2"],
  sunsetSimple: ["#FF6B4A", "#FFB347"],
  water: ["#6BB3D9", "#4A90D9", "#2E5A88"],
  waterDeep: ["#4A90D9", "#2E5A88", "#1A3A5C"],
  background: ["#1A3A5C", "#0F2744"],
  timerActive: ["#FF5F45", "#FF8C42"],
  timerOvertime: ["#FF5F45", "#FF3D2E"],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 48,
  timer: 72,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
