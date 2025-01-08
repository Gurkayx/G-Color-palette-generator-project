import React from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import {
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors
} from '../utils/colorUtils';

const ColorHarmony = ({ color, darkMode, onClose, onSelectColors }) => {
  const harmonies = [
    {
      name: 'Komplementer',
      description: 'Renk çemberinde karşılıklı olan renkler',
      getColors: () => [color, getComplementaryColor(color)]
    },
    {
      name: 'Analog',
      description: 'Renk çemberinde yan yana olan renkler',
      getColors: () => getAnalogousColors(color)
    },
    {
      name: 'Triadik',
      description: 'Renk çemberinde eşit aralıklarla bulunan üç renk',
      getColors: () => getTriadicColors(color)
    },
    {
      name: 'Split Komplementer',
      description: 'Bir renk ve komplementerinin yanındaki renkler',
      getColors: () => getSplitComplementaryColors(color)
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full max-w-2xl rounded-xl shadow-xl ${
          darkMode ? 'bg-[#1a1c1e] text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        <div className={`p-6 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <FiX className="w-5 h-5" />
          </button>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Renk Harmonisi</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Seçilen renk: <span className="font-mono">{color}</span>
          </p>

          <div className="space-y-6">
            {harmonies.map((harmony) => {
              const colors = harmony.getColors();
              return (
                <div key={harmony.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {harmony.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {harmony.description}
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectColors(colors)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        darkMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      Uygula
                    </button>
                  </div>
                  <div className={`flex gap-2 p-1 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                    {colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex-1 h-20 rounded-lg shadow-inner"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ColorHarmony; 