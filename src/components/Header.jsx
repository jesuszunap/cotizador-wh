import React from 'react';
import { History } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

/**
 * Header component.
 * Displays the branding section with inline SVG logo and main actions (History, Theme toggle).
 */
export default function Header({ theme, toggleTheme, onOpenHistory }) {
  const logoUrl = `${import.meta.env.BASE_URL}logo-WH-36.png`;

  return (
    <header className="app-header">
      <div className="brand-section">
        <img 
          src={logoUrl} 
          alt="Cotizador WH Logo" 
          className="brand-logo"
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%',
            objectFit: 'contain',
            boxShadow: 'none',
            padding: 0,
            background: 'transparent'
          }}
        />
        <h1 className="brand-title">Cotizador WH</h1>
      </div>
      <div className="header-actions">
        <button 
          className="btn-icon-only" 
          onClick={onOpenHistory}
          title="Ver historial de cotizaciones"
          aria-label="Ver historial"
        >
          <History size={20} />
        </button>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
}
