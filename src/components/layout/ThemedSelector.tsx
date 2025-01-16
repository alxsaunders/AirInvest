'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-gray-700/50 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 
          focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-10"
      >
        <option value="night">Night Theme</option>
        <option value="day">Day Theme</option>
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}