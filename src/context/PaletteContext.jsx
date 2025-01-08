import React, { createContext, useContext, useState, useEffect } from 'react';

const PaletteContext = createContext();

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePalette hook must be used within a PaletteProvider');
  }
  return context;
};

export const PaletteProvider = ({ children }) => {
  const [savedPalettes, setSavedPalettes] = useState(() => {
    const saved = localStorage.getItem('savedPalettes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const savePalette = (colors, name = null) => {
    const newPalette = {
      id: Date.now(),
      colors,
      name: name || `Palet #${savedPalettes.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setSavedPalettes(prev => [newPalette, ...prev]);
    return newPalette;
  };

  const deletePalette = (id) => {
    setSavedPalettes(prev => prev.filter(palette => palette.id !== id));
  };

  const updatePalette = (id, updates) => {
    setSavedPalettes(prev =>
      prev.map(palette =>
        palette.id === id ? { ...palette, ...updates } : palette
      )
    );
  };

  return (
    <PaletteContext.Provider
      value={{
        savedPalettes,
        savePalette,
        deletePalette,
        updatePalette,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
}; 