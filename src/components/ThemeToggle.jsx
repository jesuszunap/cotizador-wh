import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Theme toggle button component.
 * Alternates between light and dark themes using Vector Lucide icons.
 */
export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      className="btn-icon-only"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      aria-label="Alternar tema"
      style={{ border: 'none' }}
    >
      {theme === 'dark' ? (
        <Sun size={20} style={{ transition: 'transform 0.5s ease' }} />
      ) : (
        <Moon size={20} style={{ transition: 'transform 0.5s ease' }} />
      )}
    </button>
  );
}
