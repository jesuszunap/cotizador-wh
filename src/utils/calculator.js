/**
 * Utility functions for Cotizador WH calculations.
 * Implementing precise mathematical formulas from AppSheet/Excel.
 */

/**
 * Rounds a number to a specified number of decimal places accurately.
 * Uses EPSILON to avoid floating-point rounding issues.
 * @param {number} num 
 * @param {number} decimals 
 * @returns {number}
 */
export function roundTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates normal commission based on amount (Monto).
 * @param {number} monto 
 * @returns {number}
 */
export function calcularComisionNormal(monto) {
  if (monto >= 0.1 && monto <= 1) {
    return roundTo(0.05 + ((0.3 - 0.05) / (1 - 0.1)) * (monto - 0.1), 2);
  }

  if (monto < 5) {
    return roundTo((1.4 / 5) * monto, 2);
  }

  if (monto >= 5 && monto <= 20) {
    return roundTo(1.4 + 0.7 * Math.pow((monto - 5) / 15, 0.5245) - 0.0001, 2);
  }

  if (monto > 20 && monto <= 30) {
    return roundTo(monto * (10.5 - ((10.5 - 10) / Math.pow(30 - 20, 2)) * Math.pow(monto - 20, 2)) / 100 - 0.0001, 2);
  }

  if (monto > 30 && monto <= 60) {
    return roundTo(monto * 0.1 - 0.0001, 2);
  }

  if (monto > 60 && monto <= 300) {
    return roundTo(monto * (10 - ((10 - 6) / (Math.log(300) - Math.log(60))) * (Math.log(monto) - Math.log(60))) / 100 - 0.0001, 2);
  }

  if (monto > 300) {
    return roundTo(monto * 0.06 - 0.0001, 2);
  }

  return 0;
}

/**
 * Calculates commission percentage if applicable.
 * Returns percentage as factor (e.g. 0.1 for 10%).
 * @param {number} monto 
 * @param {number} comisionNormal 
 * @returns {number}
 */
export function calcularPorcentajeComision(monto, comisionNormal) {
  // Rules:
  // - If monto < 20 => 0
  // - If 30 <= monto <= 60 => 0.10
  // - If 60 < monto <= 300 => formula (no rounding)
  // - If monto > 300 => 0.06
  // - For 20 <= monto < 30 => Math.min(0.105, comisionNormal / monto)
  if (monto < 20) {
    return 0;
  }
  if (monto >= 30 && monto <= 60) {
    return 0.1;
  }
  if (monto > 60 && monto <= 300) {
    const ln = Math.log;
    const val = (10 - ((10 - 6) / (ln(300) - ln(60))) * (ln(monto) - ln(60))) / 100;
    return val; // do NOT round here; formatting happens on display
  }
  if (monto > 300) {
    return 0.06;
  }

  // In other cases (20 <= monto < 30)
  if (monto >= 20 && monto < 30) {
    return Math.min(0.105, comisionNormal / monto);
  }

  return 0;
}

/**
 * Calculates additional commission based on shipment count (envíos) and amount (monto).
 * @param {number} monto 
 * @param {number} envios 
 * @returns {number}
 */
export function calcularComisionAdicional(monto, envios) {
  // No additional commission for 1 or 2 shipments
  if (envios <= 2) {
    return 0;
  }

  if (monto >= 0.1 && monto < 5) {
    let sum = 0.15;
    if (envios > 2) sum += 0.15;
    if (envios > 3) sum += 0.10;
    if (envios > 4) sum += 0.05 * (envios - 4);
    return roundTo(sum, 2);
  }

  if (monto >= 5 && monto < 7) {
    let sum = 0.20;
    if (envios > 2) sum += 0.25;
    if (envios > 3) sum += 0.20;
    if (envios > 4) sum += 0.15;
    if (envios > 5) sum += 0.10;
    if (envios > 6) sum += 0.05 * (envios - 6);
    return roundTo(sum, 2);
  }

  if (monto >= 7 && monto < 10) {
    let sum = 0.25;
    if (envios > 2) sum += 0.35;
    if (envios > 3) sum += 0.30;
    if (envios > 4) sum += 0.25;
    if (envios > 5) sum += 0.20;
    if (envios > 6) sum += 0.15;
    if (envios > 7) sum += 0.10;
    if (envios > 8) sum += 0.05 * (envios - 8);
    return roundTo(sum, 2);
  }

  if (monto >= 10 && monto < 15) {
    let sum = 0.30;
    if (envios > 2) sum += 0.35;
    if (envios > 3) sum += 0.30;
    if (envios > 4) sum += 0.25;
    if (envios > 5) sum += 0.20;
    if (envios > 6) sum += 0.15;
    if (envios > 7) sum += 0.10;
    if (envios > 8) sum += 0.05 * (envios - 8);
    return roundTo(sum, 2);
  }

  if (monto >= 15 && monto < 20) {
    let sum = 0.35;
    if (envios > 2) sum += 0.45;
    if (envios > 3) sum += 0.40;
    if (envios > 4) sum += 0.35;
    if (envios > 5) sum += 0.30;
    if (envios > 6) sum += 0.25;
    if (envios > 7) sum += 0.20;
    if (envios > 8) sum += 0.15;
    if (envios > 9) sum += 0.10;
    if (envios > 10) sum += 0.05 * (envios - 10);
    return roundTo(sum, 2);
  }

  if (monto >= 20) {
    let sum = 0.40;
    if (envios > 2) sum += 0.45;
    if (envios > 3) sum += 0.40;
    if (envios > 4) sum += 0.35;
    if (envios > 5) sum += 0.30;
    if (envios > 6) sum += 0.25;
    if (envios > 7) sum += 0.20;
    if (envios > 8) sum += 0.15;
    if (envios > 9) sum += 0.10;
    if (envios > 10) sum += 0.05 * (envios - 10);
    return roundTo(sum, 2);
  }

  return 0;
}

/**
 * Main calculation entry point.
 * @param {number} monto 
 * @param {number} envios 
 * @returns {object}
 */
export function calcularCotizacion(monto, envios) {
  const comisionNormal = calcularComisionNormal(monto);
  const porcentajeFactor = calcularPorcentajeComision(monto, comisionNormal);
  const comisionAdicional = calcularComisionAdicional(monto, envios);
  
  // Comisión Final
  const comisionFinalVal = comisionNormal + comisionAdicional;
  
  // Monto final
  const montoFinal = roundTo(monto - comisionNormal - comisionAdicional, 2);
  
  // Efectivo Móvil
  const efectivoMovil = roundTo(montoFinal - 0.36, 2);
  
  // Condicionales de visualización
  const mostrarPorcentaje = porcentajeFactor !== 0;
  const mostrarComisionAdicional = comisionAdicional !== 0;
  const mostrarEfectivoMovil = efectivoMovil >= 1.00;
  
  return {
    monto,
    envios,
    porcentajeFactor,
    comisionNormal,
    comisionAdicional,
    comisionFinalVal,
    montoFinal,
    efectivoMovil,
    mostrarPorcentaje,
    mostrarComisionAdicional,
    mostrarEfectivoMovil
  };
}
