import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import ResultCard from './components/ResultCard';
import HistoryDrawer from './components/HistoryDrawer';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaUsers } from 'react-icons/fa';
import { calcularCotizacion } from './utils/calculator';
import { 
  getSavedTheme, 
  saveTheme, 
  getHistory, 
  saveCalculation, 
  deleteCalculation, 
  clearHistory 
} from './utils/storage';

/**
 * Main App Component.
 * Orchestrates the application state, theme switches, and layout.
 * Supports mobile-first design and desktop 2-column grids.
 */
export default function App() {
  // Theme state & Synchronization
  const [theme, setTheme] = useState(getSavedTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auto‑cotizar from URL parameters (WhatsApp/autoresponder links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const montoRaw = params.get('monto');
    if (!montoRaw) return;

    // Normalise decimal separator and validate format (max 2 decimals, numeric only)
    const montoNormalized = montoRaw.replace(',', '.');
    const validMontoRegex = /^\d+(?:[.,]\d{1,2})?$/;
    if (!validMontoRegex.test(montoRaw)) return;

    const montoNum = parseFloat(montoNormalized);
    if (isNaN(montoNum) || montoNum < 0.10) return;

    // Envios (optional)
    let enviosNum = 1;
    const enviosRaw = params.get('envios');
    if (enviosRaw) {
      const parsedEnv = parseInt(enviosRaw, 10);
      if (!isNaN(parsedEnv) && parsedEnv >= 1 && parsedEnv <= 10) {
        enviosNum = parsedEnv;
      }
    }

    // Populate form and trigger calculation
    setMontoInput(montoNum.toString().replace('.', ',')); // keep display format similar to user input
    setEnvios(enviosNum);
    handleCalculate(montoNum, enviosNum);

    // Clean URL (optional, safe for PWA/offline)
    window.history.replaceState({}, document.title, location.pathname);
  }, []);

  // Form & Result states
  const [montoInput, setMontoInput] = useState('');
  const [envios, setEnvios] = useState(1);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState(null);

  // History Drawer state & Synchronization
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  // Load history on mount
  useEffect(() => {
    setHistoryList(getHistory());
  }, []);

  // Form Actions
  const handleCalculate = (monto, enviosQty) => {
    const result = calcularCotizacion(monto, enviosQty);
    setResultData(result);
    // Guardar automáticamente en historial
    saveCalculation(result);
    setHistoryList(getHistory());
  };

  const handleClear = () => {
    setResultData(null);
  };


  const handleLoadCalculation = (savedItem) => {
    // Prefill form
    setMontoInput(savedItem.monto.toString());
    setEnvios(savedItem.envios);
    setError('');
    
    // Display results immediately
    setResultData({
      monto: savedItem.monto,
      envios: savedItem.envios,
      porcentajeFactor: savedItem.porcentajeFactor,
      comisionNormal: savedItem.comisionNormal,
      comisionAdicional: savedItem.comisionAdicional,
      comisionFinalVal: savedItem.comisionFinalVal,
      montoFinal: savedItem.montoFinal,
      efectivoMovil: savedItem.efectivoMovil,
      mostrarPorcentaje: savedItem.mostrarPorcentaje,
      mostrarComisionAdicional: savedItem.mostrarComisionAdicional,
      mostrarEfectivoMovil: savedItem.mostrarEfectivoMovil
    });
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = deleteCalculation(id);
    setHistoryList(updated);
  };

  const handleClearAllHistory = () => {
    clearHistory();
    setHistoryList([]);
  };

  return (
    <div className="app-container">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenHistory={() => setIsHistoryOpen(true)} 
      />

      <main className="main-layout">
        {/* Left Column: Input Form */}
        <section className={`view-form ${resultData ? 'hidden-mobile' : ''}`} aria-label="Formulario de entrada">
          <CalculatorForm
            montoInput={montoInput}
            setMontoInput={setMontoInput}
            envios={envios}
            setEnvios={setEnvios}
            onCalculate={handleCalculate}
            onClear={handleClear}
            error={error}
            setError={setError}
          />
          <div className="social-links">
            <a 
              href="https://wa.me/593995180410" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp"
              title="Escríbenos a WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
            <a 
              href="https://www.instagram.com/world.hezu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              title="Síguenos en Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61567371940441&locale=es_LA" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              title="Síguenos en Facebook"
            >
              <FaFacebookF size={19} />
            </a>
            <a 
              href="https://www.facebook.com/groups/3823900527841007?locale=es_LA" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Grupo de Facebook"
              title="Únete a nuestro Grupo de Facebook"
            >
              <FaUsers size={20} />
            </a>
          </div>
        </section>

        {/* Right Column: Calculations Results */}
        <section className={`view-result ${!resultData ? 'hidden-mobile' : ''}`} aria-label="Resultado de cotización" style={{ minWidth: 0 }}>
          {resultData ? (
            <ResultCard 
              data={resultData}
              theme={theme}
              onBack={() => setResultData(null)}
            />
          ) : (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '260px', padding: '40px' }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(109, 40, 217, 0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'var(--primary)'
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="9" y1="22" x2="9" y2="16"></line>
                  <line x1="15" y1="22" x2="15" y2="16"></line>
                  <line x1="18" y1="16" x2="6" y2="16"></line>
                  <path d="M18 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                  <line x1="8" y1="6" x2="16" y2="6"></line>
                  <line x1="8" y1="10" x2="16" y2="10"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>Cotizador WH</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px' }}>
                Ingresa un monto y la cantidad de envíos para cotizar valores instantáneamente.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Slide-out Drawer for History list */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onLoadCalculation={handleLoadCalculation}
        onDeleteCalculation={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
