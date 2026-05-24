import React, { useRef, useState } from 'react';
import { Copy, Download, Check, ArrowLeft } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { toPng } from 'html-to-image';
import { 
  formatCurrencyDot, 
  formatPercent, 
  formatComisionFinal,
} from '../utils/formatters';

/**
 * Format percent with smaller font for the third decimal (thousandth)
 */
function PercentDisplay({ factor }) {
  const percentStr = (factor * 100).toFixed(3);
  const parts = percentStr.split('.');
  const integer = parts[0];
  const decimals = parts[1];
  
  if (!decimals || decimals.length < 3) {
    return <span>{percentStr}%</span>;
  }
  
  const firstTwoDecimals = decimals.substring(0, 2);
  const thirdDecimal = decimals.substring(2, 3);
  
  return (
    <span>
      {integer}.{firstTwoDecimals}
      <span style={{ fontSize: '0.7em', opacity: 0.8 }}>{thirdDecimal}</span>%
    </span>
  );
}

/**
 * Generates exact text visible in the ticket for copy/paste.
 * @param {object} res - Calculation result data
 * @returns {string}
 */
export function generateResultText(res) {
  const lines = [];
  const hasRate = res.mostrarPorcentaje && res.porcentajeFactor !== 0;
  
  lines.push("Monto enviado o a enviar:");
  lines.push(formatCurrencyDot(res.monto));
  
  if (res.mostrarComisionAdicional) {
    lines.push("Comisión normal:");
    lines.push(formatCurrencyDot(res.comisionNormal));

    lines.push("¿Cuántos envíos va a realizar?");
    lines.push(res.envios.toString());
    
    lines.push("Comisión adicional por envíos:");
    lines.push(formatCurrencyDot(res.comisionAdicional));
  }
  
  lines.push("Comisión final:");
  lines.push(formatComisionFinal(res.comisionNormal, res.comisionAdicional));

  if (hasRate) {
    lines.push(res.mostrarComisionAdicional ? "Tasa base aplicada:" : "Tasa aplicada:");
    lines.push(formatPercent(res.porcentajeFactor));
  }

  lines.push("Monto final a transferir:");
  lines.push(formatCurrencyDot(res.montoFinal));
  
  if (res.mostrarEfectivoMovil) {
    lines.push("Efectivo Móvil (Banco del Barrio):");
    lines.push(formatCurrencyDot(res.efectivoMovil));
  }
  
  return lines.join("\n");
}

/**
 * ResultCard component.
 * Displays calculated values as a digital ticket and provides copy, save, and share tools.
 */
export default function ResultCard({ data, theme, onBack }) {
  const ticketRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleCopy = async () => {
    const text = generateResultText(data);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };



  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        backgroundColor: theme === 'dark' ? '#0F0F16' : '#F5F5FA',
        style: {
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        }
      });
      const link = document.createElement('a');
      link.download = `cotizacion_${data.monto.toFixed(2)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  const handleCopyImage = async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        backgroundColor: theme === 'dark' ? '#0B0B0F' : '#F5F5FA',
        style: {
          borderRadius: '16px',
          padding: '24px'
        }
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // Try Clipboard API with image support
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const clipboardItem = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([clipboardItem]);
          alert('Imagen copiada al portapapeles.');
          return;
        } catch (err) {
          console.warn('Clipboard image write failed:', err);
          // fallthrough to fallback message
        }
      }

      alert('No se pudo copiar la imagen. Puedes descargarla o compartirla.');
    } catch (err) {
      console.error('Error copiando imagen:', err);
      alert('No se pudo copiar la imagen. Puedes descargarla o compartirla.');
    }
  };

  const handleShareWhatsApp = async () => {
    if (!ticketRef.current) return;
    setSharing(true);
    try {
      // 1. Generate image using html-to-image
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        backgroundColor: theme === 'dark' ? '#0B0B0F' : '#F5F5FA',
        style: {
          borderRadius: '16px',
          padding: '24px',
          border: '2px solid rgba(139, 92, 246, 0.4)'
        }
      });

      // 2. Convert base64 image data to a Blob file
      const blobRes = await fetch(dataUrl);
      const blob = await blobRes.blob();
      const file = new File([blob], 'cotizacion-wh.png', { type: 'image/png' });

      // 3. Attempt Web Share API (Mobile App / supported PWA browser)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Cotización - Cotizador WH',
          text: `Cotización WH - Monto: ${formatCurrencyDot(data.monto)}`
        });
      } else {
        // Fallback: Download file and open WhatsApp link with text
        const link = document.createElement('a');
        link.download = `cotizacion_${data.monto.toFixed(2)}.png`;
        link.href = dataUrl;
        link.click();
        
        const rawText = generateResultText(data);
        const encodedText = encodeURIComponent(rawText);
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
      // Absolute fallback: Share text only
      const text = generateResultText(data);
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="result-card-container">
      

      <div className="ticket-wrapper" ref={ticketRef} id="ticket-cotizacion">
        <div className="ticket-header-simple">
          <span className="ticket-header-title">Resumen de Cotización</span>
        </div>

        <div className="ticket-line">
          <div className="ticket-label">Monto enviado</div>
          <div className="ticket-value ticket-value--monto">{formatCurrencyDot(data.monto)}</div>
        </div>

        {!data.mostrarComisionAdicional ? (
          <div className="ticket-line">
            <div className="ticket-label">Comisión</div>
            <div className="ticket-value">{formatCurrencyDot(data.comisionNormal)}</div>
          </div>
        ) : (
          <>
            <div className="ticket-line">
              <div className="ticket-label">Comisión normal</div>
              <div className="ticket-value">{formatCurrencyDot(data.comisionNormal)}</div>
            </div>

            <div className="ticket-line">
              <div className="ticket-label">¿Cuántos envíos va a realizar?</div>
              <div className="ticket-value">{data.envios}</div>
            </div>

            <div className="ticket-line">
              <div className="ticket-label">Comisión adicional por envíos</div>
              <div className="ticket-value">{formatCurrencyDot(data.comisionAdicional)}</div>
            </div>

            <div className="ticket-line">
              <div className="ticket-label">Comisión final</div>
              <div className="ticket-value">
                {formatComisionFinal(data.comisionNormal, data.comisionAdicional)}
              </div>
            </div>
          </>
        )}

        {data.mostrarPorcentaje && data.porcentajeFactor !== 0 && (
          <div className="ticket-rate ticket-rate--global">
            {data.mostrarComisionAdicional ? 'Tasa base aplicada' : 'Tasa aplicada'}: {formatPercent(data.porcentajeFactor)}
          </div>
        )}

        <div className="ticket-line ticket-line--separator">
          <div className="ticket-label">Monto a transferir</div>
          <div className="ticket-value highlight">
            {formatCurrencyDot(data.montoFinal)}
          </div>
        </div>

        {data.mostrarEfectivoMovil ? (
          <div className="ticket-line">
            <div className="ticket-label">Efectivo Móvil</div>
            <div className="ticket-value ticket-value--efectivo">
              {formatCurrencyDot(data.efectivoMovil)}
            </div>
          </div>
        ) : (
          <div className="ticket-line ticket-line--muted">
            <div className="ticket-label">Efectivo Móvil</div>
            <div className="ticket-note">No disponible para este monto</div>
          </div>
        )}
      </div>

      {/* Hidden textarea for simple exact visual copying check */}
      <textarea 
        readOnly 
        className="copyable-text-area" 
        value={generateResultText(data)} 
        id="hidden-copy-area"
      />

      <div className="result-actions">
        <button 
          className="btn btn-primary result-action-main" 
          onClick={handleShareWhatsApp} 
          disabled={sharing}
          title="Compartir resultado por WhatsApp como imagen"
        >
          <FaWhatsapp size={18} />
          {sharing ? 'Procesando...' : 'Compartir por WhatsApp'}
        </button>

        <div className="result-action-grid">
          <button 
            className="btn btn-secondary" 
            onClick={handleCopy} 
            title="Copiar texto de cotización"
          >
            {copied ? <Check size={18} style={{ color: 'var(--success)' }} /> : <Copy size={18} />}
            {copied ? 'Copiado' : 'Copiar texto'}
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={handleCopyImage} 
            title="Copiar cotización como imagen"
          >
            <Copy size={18} />
            Copiar imagen
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={handleDownload} 
            title="Descargar cotización como imagen PNG"
          >
            <Download size={18} />
            Descargar
          </button>

          <button 
            className="btn btn-secondary btn-new-quote" 
            onClick={onBack} 
            title="Nueva cotización"
          >
            <ArrowLeft size={18} />
            Nueva cotización
          </button>
        </div>
      </div>
    </div>
  );
}
