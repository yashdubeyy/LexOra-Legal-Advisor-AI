"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get initial theme preference from localStorage (if available) or system preference
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Only run this once on mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // On mount, read from localStorage or set based on system preference
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (systemPrefersDark) {
      setThemeState("dark");
    }
  }, []);

  useEffect(() => {
    // Only update DOM after mount to avoid hydration mismatch
    if (!mounted) return;

    // Update the HTML class whenever theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Force a specific theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Provide a value object that won't change unless theme changes
  const contextValue = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
