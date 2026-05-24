/**
 * Utility functions for local storage management (history and theme).
 */

const HISTORY_KEY = 'cotizador_wh_history';
const THEME_KEY = 'cotizador_wh_theme';

/**
 * Gets the current theme from localStorage.
 * @returns {string} 'dark' or 'light'
 */
export function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Saves the theme preference in localStorage.
 * @param {string} theme 'dark' or 'light'
 */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Gets the history of calculations.
 * @returns {Array<object>} List of saved calculations
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading history from localStorage:', error);
    return [];
  }
}

/**
 * Saves a single calculation into history.
 * No date or time is saved, only the final raw mathematical results.
 * @param {object} calculation 
 * @returns {Array<object>} The updated history list
 */
export function saveCalculation(calculation) {
  const currentHistory = getHistory();
  
  // Create a unique id for React mapping and deletion
  const newEntry = {
    id: 'calc_' + Math.random().toString(36).substr(2, 9),
    monto: calculation.monto,
    envios: calculation.envios,
    porcentajeFactor: calculation.porcentajeFactor,
    comisionNormal: calculation.comisionNormal,
    comisionAdicional: calculation.comisionAdicional,
    comisionFinalVal: calculation.comisionFinalVal,
    montoFinal: calculation.montoFinal,
    efectivoMovil: calculation.efectivoMovil,
    mostrarPorcentaje: calculation.mostrarPorcentaje,
    mostrarComisionAdicional: calculation.mostrarComisionAdicional,
    mostrarEfectivoMovil: calculation.mostrarEfectivoMovil
  };
  
  // Prevent duplicate consecutive entries to keep history clean
  const isDuplicate = currentHistory.length > 0 && 
    currentHistory[0].monto === newEntry.monto &&
    currentHistory[0].envios === newEntry.envios &&
    currentHistory[0].comisionFinalVal === newEntry.comisionFinalVal;

  if (isDuplicate) {
    return currentHistory; // No need to save duplicates consecutive
  }

  // Prepend to list, keeping max 50 entries
  const updatedHistory = [newEntry, ...currentHistory].slice(0, 50);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving history to localStorage:', error);
  }
  
  return updatedHistory;
}

/**
 * Deletes a single calculation by id.
 * @param {string} id 
 * @returns {Array<object>} The updated history list
 */
export function deleteCalculation(id) {
  const currentHistory = getHistory();
  const updatedHistory = currentHistory.filter(item => item.id !== id);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error updating history in localStorage:', error);
  }
  
  return updatedHistory;
}

/**
 * Clears the calculation history.
 */
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}
