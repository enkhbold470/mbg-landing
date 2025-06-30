/**
 * Color System for CSS Variables Approach
 * This file provides utilities and defaults for working with CSS custom properties
 */

/**
 * Default HSL values that match our CSS variables
 * These are the fallback values if CSS variables aren't loaded
 */



export const defaultColors = {
  // Light theme defaults
  light: {
    background: '210 20% 98%',
    foreground: '222 47% 11%',
    primary: '217 91% 60%',
    primaryForeground: '0 0% 100%',
    secondary: '330 81% 60%',
    secondaryForeground: '0 0% 100%',
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    muted: '210 20% 92%',
    mutedForeground: '215 16% 47%',
    border: '214 32% 91%',
    input: '214 32% 91%',
    ring: '217 91% 60%',
  },
  // Dark theme defaults
  dark: {
    background: '224 71% 4%',
    foreground: '213 31% 91%',
    primary: '217 91% 60%',
    primaryForeground: '224 71% 4%',
    secondary: '330 81% 60%',
    secondaryForeground: '224 71% 4%',
    destructive: '0 63% 31%',
    destructiveForeground: '213 31% 91%',
    muted: '223 47% 11%',
    mutedForeground: '215 20% 65%',
    border: '216 34% 17%',
    input: '216 34% 17%',
    ring: '217 91% 60%',
  },
};

/**
 * Hex color equivalents for easier reference and theme customization
 */
export const hexColors = {
  primary: '#3b82f6',    // Blue-500
  secondary: '#ec4899',  // Pink-500
  success: '#10b981',    // Green-500
  warning: '#f59e0b',    // Amber-500
  error: '#ef4444',      // Red-500
  info: '#0ea5e9',       // Sky-500
  gold: '#facc15',       // Yellow-400
};

/**
 * Convert hex to HSL format for CSS variables
 */
export const hexToHsl = (hex: string): string => {
  // Remove hash
  const cleanHex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const add = max + min;
  const l = add * 0.5;

  let h = 0;
  let s = 0;

  if (diff !== 0) {
    s = l < 0.5 ? diff / add : diff / (2 - add);
    
    switch (max) {
      case r:
        h = ((g - b) / diff) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  return `${h} ${s}% ${lightness}%`;
};

/**
 * Apply theme colors to CSS variables
 */
export const applyTheme = (colors: Record<string, string>, isDark = false) => {
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    
    // Convert hex to HSL if needed
    const hslValue = value.startsWith('#') ? hexToHsl(value) : value;
    
    root.style.setProperty(cssVar, hslValue);
  });
  
  // Toggle dark class
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * Get current theme colors from CSS variables
 */
export const getCurrentTheme = () => {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  
  return {
    isDark,
    colors: isDark ? defaultColors.dark : defaultColors.light,
  };
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = () => {
  const root = document.documentElement;
  root.classList.toggle('dark');
  
  return root.classList.contains('dark');
};

// Legacy exports for backward compatibility
export const coreColors = hexColors;
export const colors = hexColors;
export default hexColors;
