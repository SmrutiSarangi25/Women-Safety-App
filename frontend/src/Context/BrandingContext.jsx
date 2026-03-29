import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRANDS, DEFAULT_BRAND } from '../Config/BrandingConfig';

const BrandingContext = createContext();

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState(DEFAULT_BRAND);
  const [brandData, setBrandData] = useState(BRANDS[DEFAULT_BRAND]);

  // Load brand from localStorage on mount
  useEffect(() => {
    const savedBrand = localStorage.getItem('selectedBrand');
    if (savedBrand && BRANDS[savedBrand]) {
      setCurrentBrand(savedBrand);
      setBrandData(BRANDS[savedBrand]);
    }
  }, []);

  const switchBrand = (brandKey) => {
    if (BRANDS[brandKey]) {
      setCurrentBrand(brandKey);
      setBrandData(BRANDS[brandKey]);
      localStorage.setItem('selectedBrand', brandKey);

      // Apply CSS custom properties for dynamic theming
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', BRANDS[brandKey].colors.primary);
      root.style.setProperty('--brand-secondary', BRANDS[brandKey].colors.secondary);
      root.style.setProperty('--brand-accent', BRANDS[brandKey].colors.accent);
      root.style.setProperty('--brand-text', BRANDS[brandKey].colors.text);
      root.style.setProperty('--brand-light-text', BRANDS[brandKey].colors.lightText);
    }
  };

  const updateBrand = (brandKey, updates) => {
    if (BRANDS[brandKey]) {
      const updatedBrand = { ...BRANDS[brandKey], ...updates };
      BRANDS[brandKey] = updatedBrand;

      if (currentBrand === brandKey) {
        setBrandData(updatedBrand);
      }
    }
  };

  const value = {
    currentBrand,
    brandData,
    switchBrand,
    updateBrand,
    availableBrands: Object.keys(BRANDS)
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};