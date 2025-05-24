import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and resolves Tailwind CSS class conflicts
 * @param  {...any} inputs - Class names to combine
 * @returns {string} - Combined class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a file size number into a human-readable string
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size string
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Generate a random ID for elements that need unique identifiers
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Random unique ID
 */
export function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Debounce a function to prevent multiple rapid calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 