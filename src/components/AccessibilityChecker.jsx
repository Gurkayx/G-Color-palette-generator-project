import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiCheck, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { getContrastYIQ } from '../utils/colorUtils';

const colorBlindTypes = [
  { 
    id: 'protanopia', 
    name: 'Kırmızı Renk Körlüğü',
    description: 'Kırmızı rengi algılamada zorluk yaşayan kullanıcılar için simülasyon'
  },
  { 
    id: 'deuteranopia', 
    name: 'Yeşil Renk Körlüğü',
    description: 'Yeşil rengi algılamada zorluk yaşayan kullanıcılar için simülasyon'
  },
  { 
    id: 'tritanopia', 
    name: 'Mavi Renk Körlüğü',
    description: 'Mavi rengi algılamada zorluk yaşayan kullanıcılar için simülasyon'
  },
];

const simulateColorBlindness = (color, type) => {
  const rgb = color.match(/\w\w/g).map(x => parseInt(x, 16));
  
  switch (type) {
    case 'protanopia':
      return `rgb(${rgb[1]}, ${rgb[1]}, ${rgb[2]})`;
    case 'deuteranopia':
      return `rgb(${rgb[0]}, ${rgb[2]}, ${rgb[2]})`;
    case 'tritanopia':
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[1]})`;
    default:
      return color;
  }
};

const calculateWCAGContrast = (color1, color2) => {
  const rgb1 = color1.match(/\w\w/g).map(x => parseInt(x, 16));
  const rgb2 = color2.match(/\w\w/g).map(x => parseInt(x, 16));
  
  const l1 = 0.2126 * rgb1[0] + 0.7152 * rgb1[1] + 0.0722 * rgb1[2];
  const l2 = 0.2126 * rgb2[0] + 0.7152 * rgb2[1] + 0.0722 * rgb2[2];
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio.toFixed(2);
};

const AccessibilityChecker = ({ colors, darkMode }) => {
  const [activeTab, setActiveTab] = useState('contrast');

  const getWCAGLevel = (ratio) => {
    if (ratio >= 7) return { level: 'AAA', color: 'text-green-500' };
    if (ratio >= 4.5) return { level: 'AA', color: 'text-green-500' };
    if (ratio >= 3) return { level: 'AA (Büyük Metin)', color: 'text-yellow-500' };
    return { level: 'Başarısız', color: 'text-red-500' };
  };

  const tabs = [
    { id: 'contrast', name: 'Kontrast', icon: FiEye },
    { id: 'colorblind', name: 'Renk Körlüğü', icon: FiInfo },
  ];

  return (
    <div className={`rounded-xl shadow-xl overflow-hidden ${
      darkMode ? 'bg-[#1a1c1e]' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-100' : 'border-gray-800'}`}>
        <h3 className={`text-xl font-semibold flex items-center gap-2 ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          <FiEye className={`${darkMode ? 'border-gray-100' : 'border-gray-800'}`} />
          Erişilebilirlik Kontrolü
        </h3>
      </div>

      {/* Tabs */}
      <div className={`border-b ${darkMode ? 'border-gray-100' : 'border-gray-800'}`}>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative
                ${activeTab === tab.id
                  ? darkMode
                    ? 'text-indigo-400 bg-gray-800/50'
                    : 'text-indigo-600 bg-indigo-50'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'contrast' && (
          <div className="space-y-6">
            {colors.map((color, i) => {
              const whiteContrast = calculateWCAGContrast(color, '#FFFFFF');
              const blackContrast = calculateWCAGContrast(color, '#000000');
              const darkBgContrast = calculateWCAGContrast(color, '#1a1c1e');
              
              const whiteLevel = getWCAGLevel(whiteContrast);
              const blackLevel = getWCAGLevel(blackContrast);
              const darkBgLevel = getWCAGLevel(darkBgContrast);

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg shadow-inner"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {color.toUpperCase()}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Kontrast Oranı Kontrolü
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {/* Beyaz Arka Plan */}
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">Beyaz Arka Plan</span>
                        <span className={`text-sm font-medium ${whiteLevel.color}`}>
                          {whiteLevel.level} ({whiteContrast}:1)
                        </span>
                      </div>
                      <div
                        className="h-10 rounded flex items-center justify-center text-sm"
                        style={{ backgroundColor: color, color: getContrastYIQ(color) }}
                      >
                        Örnek Metin
                      </div>
                    </div>

                    {/* Siyah Arka Plan */}
                    <div className="bg-black p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Siyah Arka Plan</span>
                        <span className={`text-sm font-medium ${blackLevel.color}`}>
                          {blackLevel.level} ({blackContrast}:1)
                        </span>
                      </div>
                      <div
                        className="h-10 rounded flex items-center justify-center text-sm"
                        style={{ backgroundColor: color, color: getContrastYIQ(color) }}
                      >
                        Örnek Metin
                      </div>
                    </div>

                    {darkMode && (
                      <div className={`bg-[#1a1c1e] p-3 rounded-lg border border-gray-800`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Koyu Tema Arka Plan</span>
                          <span className={`text-sm font-medium ${darkBgLevel.color}`}>
                            {darkBgLevel.level} ({darkBgContrast}:1)
                          </span>
                        </div>
                        <div
                          className="h-10 rounded flex items-center justify-center text-sm"
                          style={{ backgroundColor: color, color: getContrastYIQ(color) }}
                        >
                          Örnek Metin
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === 'colorblind' && (
          <div className="space-y-6">
            {colorBlindTypes.map((type) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {type.name}
                    </h4>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {type.description}
                    </p>
                  </div>
                  <FiAlertCircle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {colors.map((color, i) => (
                    <div key={i} className="space-y-2">
                      <div
                        className="h-16 rounded-lg shadow-inner"
                        style={{ backgroundColor: simulateColorBlindness(color, type.id) }}
                      />
                      <div className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {color.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-3 flex items-center gap-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                <FiInfo className="text-indigo-500" />
                Öneriler
              </h4>
              <ul className={`space-y-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Yeterli kontrast oranı için açık renklerle koyu renkleri birlikte kullanın (minimum 4.5:1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Önemli bilgileri sadece renkle değil, simge veya metinle de destekleyin</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Renk körlüğü olan kullanıcılar için yüksek kontrastlı renk kombinasyonları tercih edin</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityChecker; 