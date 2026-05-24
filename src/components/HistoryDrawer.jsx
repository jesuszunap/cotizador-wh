import React from 'react';
import { X, Trash2, Trash } from 'lucide-react';
import { formatCurrencyDot, formatComisionFinal } from '../utils/formatters';

/**
 * HistoryDrawer component.
 * Displays a list of saved calculations in a responsive right-side sliding panel.
 * Tapping a calculation loads it back to the form and result screens.
 */
export default function HistoryDrawer({
  isOpen,
  onClose,
  historyList,
  onLoadCalculation,
  onDeleteCalculation,
  onClearAll
}) {
  return (
    <>
      <div 
        className={`drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`drawer-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Historial de Cotizaciones"
      >
        <div className="drawer-header">
          <h2 className="drawer-title">Historial</h2>
          <button 
            className="btn-icon-only" 
            style={{ border: 'none' }} 
            onClick={onClose}
            aria-label="Cerrar historial"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="drawer-body">
          {historyList.length === 0 ? (
            <p className="empty-history-text">No hay cotizaciones guardadas en este dispositivo.</p>
          ) : (
            historyList.map((item) => (
              <div 
                key={item.id} 
                className="history-item"
                onClick={() => {
                  onLoadCalculation(item);
                  onClose();
                }}
                title="Haga clic para cargar este cálculo"
              >
                <div className="history-item-details">
                  <div className="history-item-primary">
                    Monto: {formatCurrencyDot(item.monto)}
                  </div>
                  <div className="history-item-secondary">
                    Envíos: {item.envios} | Comisión: {formatComisionFinal(item.comisionNormal, item.comisionAdicional)}
                  </div>
                </div>
                
                <div className="history-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn-delete-history"
                    onClick={() => onDeleteCalculation(item.id)}
                    title="Eliminar de historial"
                    aria-label="Eliminar registro"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {historyList.length > 0 && (
          <div className="drawer-footer">
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                if (window.confirm('¿Está seguro de que desea vaciar todo su historial local?')) {
                  onClearAll();
                }
              }}
              style={{ 
                width: '100%', 
                borderColor: 'var(--danger)', 
                color: 'var(--danger)', 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center',
                backgroundColor: 'rgba(239, 68, 68, 0.05)'
              }}
            >
              <Trash size={16} />
              Vaciar Historial
            </button>
          </div>
        )}
      </div>
    </>
  );
}
