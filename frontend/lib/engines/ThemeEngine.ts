/**
 * DQ Orbit — Theme Engine
 * 
 * Configurable theme system that generates CSS custom properties from JSON.
 * Each client/tenant can have their own theme. Switching themes is instant.
 */

export type DQOrbitTheme = {
  name: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
  };
  chartPalette: string[];
  font: {
    sans: string;
    mono: string;
  };
  radius: string;
  spacing: {
    cardPadding: string;
    sectionGap: string;
  };
  animation: {
    duration: string;
    easing: string;
  };
};

// Default DQ Orbit theme: Slate + Indigo enterprise design
export const DEFAULT_THEME: DQOrbitTheme = {
  name: "DQ Orbit Default",
  colors: {
    primary: "234 89% 74%",          // Indigo-400
    primaryForeground: "0 0% 100%",
    secondary: "215 28% 17%",        // Slate-800
    secondaryForeground: "210 40% 98%",
    background: "222 47% 11%",       // Slate-900
    foreground: "210 40% 98%",       // Slate-50
    card: "217 33% 17%",             // Slate-800
    cardForeground: "210 40% 98%",
    muted: "217 33% 17%",
    mutedForeground: "215 20% 65%",  // Slate-400
    border: "217 33% 25%",           // Slate-700
    accent: "234 89% 74%",           // Indigo-400
    accentForeground: "0 0% 100%",
    destructive: "0 84% 60%",        // Red-500
    destructiveForeground: "0 0% 100%",
    success: "142 71% 45%",          // Emerald-500
    successForeground: "0 0% 100%",
    warning: "38 92% 50%",           // Amber-500
    warningForeground: "0 0% 0%",
  },
  chartPalette: [
    "#818cf8",  // Indigo-400
    "#34d399",  // Emerald-400
    "#fbbf24",  // Amber-400
    "#f87171",  // Red-400
    "#60a5fa",  // Blue-400
    "#a78bfa",  // Violet-400
    "#fb923c",  // Orange-400
    "#2dd4bf",  // Teal-400
    "#f472b6",  // Pink-400
    "#94a3b8",  // Slate-400
  ],
  font: {
    sans: "var(--font-geist-sans), 'Inter', system-ui, sans-serif",
    mono: "var(--font-geist-mono), 'JetBrains Mono', monospace",
  },
  radius: "0.5rem",
  spacing: {
    cardPadding: "1.5rem",
    sectionGap: "1.5rem",
  },
  animation: {
    duration: "200ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Light theme variant
export const LIGHT_THEME: DQOrbitTheme = {
  ...DEFAULT_THEME,
  name: "DQ Orbit Light",
  colors: {
    primary: "234 89% 54%",          // Indigo-600
    primaryForeground: "0 0% 100%",
    secondary: "210 40% 96%",        // Slate-100
    secondaryForeground: "222 47% 11%",
    background: "0 0% 100%",         // White
    foreground: "222 47% 11%",       // Slate-900
    card: "0 0% 100%",
    cardForeground: "222 47% 11%",
    muted: "210 40% 96%",            // Slate-100
    mutedForeground: "215 16% 47%",  // Slate-500
    border: "214 32% 91%",           // Slate-200
    accent: "234 89% 54%",
    accentForeground: "0 0% 100%",
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 100%",
    success: "142 71% 45%",
    successForeground: "0 0% 100%",
    warning: "38 92% 50%",
    warningForeground: "0 0% 0%",
  },
};

/**
 * Apply a theme by injecting CSS custom properties on the root element.
 */
export function applyTheme(theme: DQOrbitTheme): void {
  if (typeof document === "undefined") return;
  
  const root = document.documentElement;
  const { colors } = theme;
  
  Object.entries(colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
  
  root.style.setProperty("--radius", theme.radius);
  root.style.setProperty("--font-sans", theme.font.sans);
  root.style.setProperty("--font-mono", theme.font.mono);
  root.style.setProperty("--animation-duration", theme.animation.duration);
  root.style.setProperty("--animation-easing", theme.animation.easing);
  root.style.setProperty("--card-padding", theme.spacing.cardPadding);
  root.style.setProperty("--section-gap", theme.spacing.sectionGap);
  
  // Store chart palette as CSS variables for ECharts integration
  theme.chartPalette.forEach((color, index) => {
    root.style.setProperty(`--chart-${index + 1}`, color);
  });
}

/**
 * Get the current theme's chart palette as an array of hex colors.
 * Used by ChartWidget to configure ECharts color scheme.
 */
export function getChartPalette(theme: DQOrbitTheme = DEFAULT_THEME): string[] {
  return theme.chartPalette;
}
