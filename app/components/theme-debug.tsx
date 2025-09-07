"use client";

import React from "react";
import { useTheme } from "./theme-provider";

export default function ThemeDebug() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-xs mb-2">
        Current theme: <strong>{theme}</strong>
      </div>
      <button 
        onClick={toggleTheme}
        className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
}
