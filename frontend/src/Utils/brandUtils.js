// Utility functions for brand management
export const switchToBrand = (brandKey) => {
  // This function can be called from anywhere in the app
  // It will update localStorage and trigger a re-render
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedBrand', brandKey);
    window.location.reload(); // Force reload to apply changes
  }
};

export const getCurrentBrand = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedBrand') || 'raksha';
  }
  return 'raksha';
};

export const getAvailableBrands = () => {
  return ['imsafe', 'raksha', 'custom'];
};

// Example usage:
// import { switchToBrand } from './utils/brandUtils';
// switchToBrand('imsafe'); // Switch to I'm Safe branding