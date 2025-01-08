import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ColorCard from './ColorCard';
import ColorSuggestions from './ColorSuggestions';
import { HiRefresh } from 'react-icons/hi';
import { FiSave, FiDownload, FiShare2 } from 'react-icons/fi';
import { usePalette } from '../context/PaletteContext';
import { generateRandomColor } from '../utils/colorUtils';
import toast from 'react-hot-toast';

const ColorPalette = ({ darkMode }) => {
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem('currentPalette');
    return saved ? JSON.parse(saved) : Array(5).fill('').map(() => generateRandomColor());
  });
  const [lockedColors, setLockedColors] = useState(() => {
    const saved = localStorage.getItem('lockedColors');
    return saved ? JSON.parse(saved) : Array(5).fill(false);
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [paletteName, setPaletteName] = useState('');
  
  const { savePalette } = usePalette();

  useEffect(() => {
    localStorage.setItem('currentPalette', JSON.stringify(colors));
    localStorage.setItem('lockedColors', JSON.stringify(lockedColors));
  }, [colors, lockedColors]);

  const generateNewPalette = () => {
    setColors(colors.map((color, index) => 
      lockedColors[index] ? color : generateRandomColor()
    ));
    toast.success('Yeni palet oluşturuldu');
  };

  const handleKeyPress = (event) => {
    if (event.code === 'Space') {
      generateNewPalette();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [colors, lockedColors]);

  const toggleLock = (index) => {
    const newLockedColors = [...lockedColors];
    newLockedColors[index] = !newLockedColors[index];
    setLockedColors(newLockedColors);
  };

  const changeColor = (index) => {
    const newColors = [...colors];
    newColors[index] = generateRandomColor();
    setColors(newColors);
  };

  const handleSave = () => {
    const name = paletteName.trim() || `Palet #${new Date().toLocaleTimeString()}`;
    savePalette(colors, name);
    setPaletteName('');
    setShowSaveDialog(false);
    toast.success('Palet başarıyla kaydedildi');
  };

  const exportPalette = (format) => {
    let content = '';
    switch (format) {
      case 'css':
        content = `:root {\n${colors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
        break;
      case 'scss':
        content = colors.map((color, i) => `$color-${i + 1}: ${color};`).join('\n');
        break;
      case 'json':
        content = JSON.stringify({ colors }, null, 2);
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${format}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Palet ${format.toUpperCase()} formatında dışa aktarıldı`);
  };

  const handleColorsSelect = (newColors) => {
    const updatedColors = [...colors];
    newColors.forEach((color, index) => {
      if (!lockedColors[index] && index < updatedColors.length) {
        updatedColors[index] = color;
      }
    });
    setColors(updatedColors);
    toast.success('Renk harmonisi uygulandı');
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center mb-8">
          <motion.button
            onClick={generateNewPalette}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-md
                     transition-all duration-200 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiRefresh className="w-5 h-5" />
            <span>Yeni Palet</span>
          </motion.button>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <motion.button
              onClick={() => setShowSuggestions(true)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-md
                       transition-all duration-200 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShare2 className="w-5 h-5" />
              <span>Öneriler</span>
            </motion.button>

            <motion.button
              onClick={() => setShowSaveDialog(true)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md
                       hover:bg-indigo-700 transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSave className="w-5 h-5" />
              <span>Paleti Kaydet</span>
            </motion.button>

            <div className="relative group flex-1 sm:flex-initial">
              <motion.button
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-md
                         transition-all duration-200 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload className="w-5 h-5" />
                <span>Dışa Aktar</span>
              </motion.button>
              <div className={`absolute right-0 mt-2 py-2 w-48 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-xl opacity-0 invisible
                            group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
                darkMode ? 'border border-gray-700' : ''
              }`}>
                <button
                  onClick={() => exportPalette('css')}
                  className={`block w-full px-4 py-2 text-left ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                  } transition-colors`}
                >
                  CSS Değişkenleri
                </button>
                <button
                  onClick={() => exportPalette('scss')}
                  className={`block w-full px-4 py-2 text-left ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                  } transition-colors`}
                >
                  SCSS Değişkenleri
                </button>
                <button
                  onClick={() => exportPalette('json')}
                  className={`block w-full px-4 py-2 text-left ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                  } transition-colors`}
                >
                  JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {colors.map((color, index) => (
            <ColorCard
              key={index}
              color={color}
              isLocked={lockedColors[index]}
              onToggleLock={() => toggleLock(index)}
              onColorChange={() => changeColor(index)}
              darkMode={darkMode}
              onColorsSelect={handleColorsSelect}
            />
          ))}
        </div>

        <motion.p
          className={`text-center mt-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Yeni palet oluşturmak için <span className="font-medium">boşluk</span> tuşuna basın
        </motion.p>

        {/* Modals */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Paleti Kaydet</h3>
              <input
                type="text"
                placeholder="Palet adı (isteğe bağlı)"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                onKeyDown={(e) => e.code === 'Space' && e.stopPropagation()}
                className={`w-full px-4 py-2 border rounded-lg mb-4 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                }`}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Kaydet
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showSuggestions && (
          <ColorSuggestions
            onSelectPalette={handleColorsSelect}
            onClose={() => setShowSuggestions(false)}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default ColorPalette; 