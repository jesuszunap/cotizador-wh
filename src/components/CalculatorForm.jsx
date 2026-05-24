import React from 'react';
import { DollarSign, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import { parseInputAmount } from '../utils/formatters';

/**
 * Calculator Form component.
 * Allows user input of the amount and shipment quantity.
 * Supports comma and dot decimals. Executes only on explicit submit ("Cotizar").
 */
export default function CalculatorForm({
  montoInput,
  setMontoInput,
  envios,
  setEnvios,
  onCalculate,
  onClear,
  error,
  setError
}) {
  
  const handleMontoChange = (e) => {
    setMontoInput(e.target.value);
    if (error) setError('');
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const rawInput = montoInput.trim();
    if (rawInput === '') {
      setError('Ingresa un monto para cotizar.');
      return;
    }

    const valorMonto = parseInputAmount(rawInput);
    if (isNaN(valorMonto) || valorMonto < 0.10) {
      setError('Monto mínimo: $0.10. Por favor ingresa un monto válido.');
      return;
    }

    setError('');
    onCalculate(valorMonto, envios);
  };

  const handleClearClick = () => {
    setMontoInput('');
    setEnvios(1);
    setError('');
    onClear();
  };

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h2 className="card-title">
        <DollarSign size={22} style={{ color: 'var(--primary)' }} />
        Nueva Cotización
      </h2>

      {error && (
        <div className="validation-message error" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="monto-enviado">
          Monto enviado o a enviar ($)
        </label>
        <div className="input-wrapper">
          <span className="input-icon-prefix">
            <DollarSign size={20} />
          </span>
          <input
            id="monto-enviado"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className="form-input"
            value={montoInput}
            onChange={handleMontoChange}
            autoComplete="off"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Cantidad de envíos
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'var(--input-bg)',
          border: '2px solid var(--input-border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 16px',
          justifyContent: 'space-between',
          maxWidth: '280px'
        }}>
          <button
            type="button"
            className="selector-btn"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: envios === 1 ? 'transparent' : 'rgba(109, 40, 217, 0.05)',
              opacity: envios === 1 ? 0.4 : 1,
              cursor: envios === 1 ? 'not-allowed' : 'pointer',
              border: '2px solid var(--input-border)'
            }}
            disabled={envios === 1}
            onClick={() => setEnvios(prev => Math.max(1, prev - 1))}
            aria-label="Disminuir envíos"
          >
            <Minus size={18} />
          </button>
          
          <span style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            userSelect: 'none'
          }}>
            {envios === 1 ? '1 envío' : `${envios} envíos`}
          </span>

          <button
            type="button"
            className="selector-btn"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: envios === 10 ? 'transparent' : 'rgba(109, 40, 217, 0.05)',
              opacity: envios === 10 ? 0.4 : 1,
              cursor: envios === 10 ? 'not-allowed' : 'pointer',
              border: '2px solid var(--input-border)'
            }}
            disabled={envios === 10}
            onClick={() => setEnvios(prev => Math.min(10, prev + 1))}
            aria-label="Aumentar envíos"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary" id="btn-cotizar">
          Cotizar
          <ArrowRight size={18} />
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClearClick}
          id="btn-limpiar"
        >
          <Trash2 size={18} />
          Limpiar
        </button>
      </div>
    </form>
  );
}
