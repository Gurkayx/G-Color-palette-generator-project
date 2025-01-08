import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiSun, FiDroplet, FiX, FiRefreshCw } from 'react-icons/fi';
import { generateRandomColor, hslToHex } from '../utils/colorUtils';

const hslStringToHex = (hslString) => {
  // "hsl(360, 100%, 100%)" formatındaki stringi parçalara ayır
  const values = hslString.match(/\d+/g);
  if (!values || values.length !== 3) return '#000000';
  
  // HSL değerlerini sayılara çevir
  const h = parseInt(values[0]);
  const s = parseInt(values[1]);
  const l = parseInt(values[2]);
  
  // HEX'e çevir
  return hslToHex(h, s, l);
};

const generateTrendPalettes = () => {
  return [
    {
      name: 'Modern Minimalist',
      colors: Array(5).fill('').map(() => {
        const hue = Math.floor(Math.random() * 360);
        const sat = 10 + Math.random() * 20;
        const light = 85 + Math.random() * 10;
        return hslToHex(hue, sat, light);
      }),
    },
    {
      name: 'Canlı Renkler',
      colors: Array(5).fill('').map(() => {
        const hue = Math.floor(Math.random() * 360);
        const sat = 70 + Math.random() * 30;
        const light = 45 + Math.random() * 15;
        return hslToHex(hue, sat, light);
      }),
    },
    {
      name: 'Pastel Tonlar',
      colors: Array(5).fill('').map(() => {
        const hue = Math.floor(Math.random() * 360);
        const sat = 30 + Math.random() * 20;
        const light = 80 + Math.random() * 15;
        return hslToHex(hue, sat, light);
      }),
    },
  ];
};

const generateSeasonalPalettes = () => {
  return {
    spring: Array(5).fill('').map(() => {
      const hue = 60 + Math.floor(Math.random() * 120);
      const sat = 60 + Math.random() * 40;
      const light = 70 + Math.random() * 20;
      return hslToHex(hue, sat, light);
    }),
    summer: Array(5).fill('').map(() => {
      const hue = 180 + Math.floor(Math.random() * 120);
      const sat = 70 + Math.random() * 30;
      const light = 50 + Math.random() * 20;
      return hslToHex(hue, sat, light);
    }),
    autumn: Array(5).fill('').map(() => {
      const hue = 20 + Math.floor(Math.random() * 40);
      const sat = 60 + Math.random() * 40;
      const light = 50 + Math.random() * 20;
      return hslToHex(hue, sat, light);
    }),
    winter: Array(5).fill('').map(() => {
      const hue = 200 + Math.floor(Math.random() * 60);
      const sat = 40 + Math.random() * 30;
      const light = 40 + Math.random() * 30;
      return hslToHex(hue, sat, light);
    }),
  };
};

const generateDesignTrends = () => {
  return [
    {
      name: 'Nöromorfik',
      colors: Array(5).fill('').map(() => {
        const hue = Math.floor(Math.random() * 360);
        const sat = 5 + Math.random() * 10;
        const light = 90 + Math.random() * 8;
        return hslToHex(hue, sat, light);
      }),
    },
    {
      name: 'Gradyan',
      colors: Array(5).fill('').map(() => {
        const hue = Math.floor(Math.random() * 360);
        const sat = 80 + Math.random() * 20;
        const light = 50 + Math.random() * 20;
        return hslToHex(hue, sat, light);
      }),
    },
    {
      name: 'Retro',
      colors: Array(5).fill('').map(() => {
        const hue = Math.floor(Math.random() * 360);
        const sat = 60 + Math.random() * 40;
        const light = 60 + Math.random() * 20;
        return hslToHex(hue, sat, light);
      }),
    },
  ];
};

const ColorSuggestions = ({ onSelectPalette, onClose, darkMode }) => {
  const [trendingPalettes, setTrendingPalettes] = useState(generateTrendPalettes());
  const [seasonalPalettes, setSeasonalPalettes] = useState(generateSeasonalPalettes());
  const [designTrends, setDesignTrends] = useState(generateDesignTrends());

  const regenerateAll = () => {
    setTrendingPalettes(generateTrendPalettes());
    setSeasonalPalettes(generateSeasonalPalettes());
    setDesignTrends(generateDesignTrends());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div
        className={`${
          darkMode ? 'bg-[#1a1c1e]' : 'bg-white'
        } rounded-xl shadow-xl p-6 space-y-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Renk Paleti Önerileri
          </h2>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                regenerateAll();
              }}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${
                darkMode ? 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className="w-5 h-5" />
              <span className="text-sm">Yenile</span>
            </motion.button>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              <FiTrendingUp className="text-indigo-500" />
              Trend Paletler
            </h3>
            <div className="grid gap-4">
              {trendingPalettes.map((palette, index) => (
                <motion.div
                  key={index}
                  className={`${
                    darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                  } p-4 rounded-lg cursor-pointer transition-all`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    onSelectPalette(palette.colors);
                    onClose();
                  }}
                >
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {palette.name}
                  </div>
                  <div className="flex gap-2">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-full h-12 rounded shadow-inner transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                        <div className="opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center h-full">
                          <span className={`${
                            darkMode ? 'bg-black/70' : 'bg-black/50'
                          } text-white text-xs px-2 py-1 rounded`}>
                            {color.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              <FiSun className="text-indigo-500" />
              Sezonluk Öneriler
            </h3>
            <div className="grid gap-4">
              {Object.entries(seasonalPalettes).map(([season, colors]) => (
                <motion.div
                  key={season}
                  className={`${
                    darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                  } p-4 rounded-lg cursor-pointer transition-all`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    onSelectPalette(colors);
                    onClose();
                  }}
                >
                  <div className={`text-sm font-medium mb-2 capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {season === 'spring' && 'Bahar'}
                    {season === 'summer' && 'Yaz'}
                    {season === 'autumn' && 'Sonbahar'}
                    {season === 'winter' && 'Kış'}
                  </div>
                  <div className="flex gap-2">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-full h-12 rounded shadow-inner transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                        <div className="opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center h-full">
                          <span className={`${
                            darkMode ? 'bg-black/70' : 'bg-black/50'
                          } text-white text-xs px-2 py-1 rounded`}>
                            {color.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              <FiDroplet className="text-indigo-500" />
              Tasarım Trendleri
            </h3>
            <div className="grid gap-4">
              {designTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  className={`${
                    darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                  } p-4 rounded-lg cursor-pointer transition-all`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    onSelectPalette(trend.colors);
                    onClose();
                  }}
                >
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {trend.name}
                  </div>
                  <div className="flex gap-2">
                    {trend.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-full h-12 rounded shadow-inner transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                        <div className="opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center h-full">
                          <span className={`${
                            darkMode ? 'bg-black/70' : 'bg-black/50'
                          } text-white text-xs px-2 py-1 rounded`}>
                            {color.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ColorSuggestions; 