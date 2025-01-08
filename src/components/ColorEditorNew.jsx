import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSliders, FiX, FiEye, FiMinus, FiPlus, FiDroplet, FiInfo, FiGrid } from 'react-icons/fi';
import { 
  hexToRgb, 
  rgbToHsl, 
  hslToHex, 
  rgbToHex, 
  getContrastYIQ, 
  hexToHSL, 
  calculateContrastRatio,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  createLinearGradient,
  createRadialGradient,
  createConicGradient,
  getGradientPresets,
  getGradientCSS,
  getColorAnalysis,
  findClosestColorName,
  generateColorPalettes
} from '../utils/colorUtils';

const ColorEditorNew = ({ color, onChange, onClose, isDarkMode }) => {
  // State tanımlamaları
  const [hsl, setHsl] = useState(() => {
    const initialRgb = hexToRgb(color);
    return rgbToHsl(initialRgb.r, initialRgb.g, initialRgb.b);
  });

  const [debouncedColor, setDebouncedColor] = useState(color);
  const [activeMenu, setActiveMenu] = useState(null);
  const [gradientType, setGradientType] = useState('linear');
  const [gradientAngle, setGradientAngle] = useState(90);
  const [gradientShape, setGradientShape] = useState('circle');
  const [gradientColor2, setGradientColor2] = useState(() => {
    const analogous = getAnalogousColors(color);
    return analogous[2];
  });

  // Menü değiştirme fonksiyonu
  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  // Önceden tanımlanmış renkler
  const predefinedColors = [
    { name: 'Kırmızı', hex: '#FF0000' },
    { name: 'Yeşil', hex: '#00FF00' },
    { name: 'Mavi', hex: '#0000FF' },
    { name: 'Sarı', hex: '#FFFF00' },
    { name: 'Mor', hex: '#800080' },
    { name: 'Turuncu', hex: '#FFA500' },
    { name: 'Pembe', hex: '#FFC0CB' },
    { name: 'Turkuaz', hex: '#40E0D0' }
  ];

  // Debounce fonksiyonu
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedColor(color);
    }, 300);

    return () => clearTimeout(timer);
  }, [color]);

  // HSL değişikliklerini yönet
  const handleHslChange = (type, amount) => {
    const newHsl = { ...hsl };
    
    switch (type) {
      case 'hue':
        newHsl.h = Math.min(360, Math.max(0, newHsl.h + amount));
        break;
      case 'saturation':
        newHsl.s = Math.min(100, Math.max(0, newHsl.s + amount));
        break;
      case 'lightness':
        newHsl.l = Math.min(100, Math.max(0, newHsl.l + amount));
        break;
    }
    
    setHsl(newHsl);
    const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    onChange(newColor);
  };

  // Önceden tanımlanmış rengi seç
  const handlePredefinedColor = (hexColor) => {
    const newHsl = hexToHSL(hexColor);
    setHsl({
      h: Math.round(newHsl.h),
      s: Math.round(newHsl.s),
      l: Math.round(newHsl.l)
    });
    onChange(hexColor);
  };

  // Renk değişikliklerini senkronize et
  useEffect(() => {
    if (!color) return;
    const newHsl = hexToHSL(color);
    setHsl({
      h: Math.round(newHsl.h),
      s: Math.round(newHsl.s),
      l: Math.round(newHsl.l)
    });
  }, [color]);

  // Gradyan oluşturma fonksiyonu
  const createGradient = () => {
    switch (gradientType) {
      case 'linear':
        return createLinearGradient(color, gradientColor2, gradientAngle);
      case 'radial':
        return createRadialGradient(color, gradientColor2, gradientShape);
      case 'conic':
        return createConicGradient(color, gradientColor2, gradientAngle);
      default:
        return createLinearGradient(color, gradientColor2);
    }
  };

  // Gradyan CSS kodunu kopyala
  const copyGradientCSS = () => {
    const css = getGradientCSS(createGradient());
    navigator.clipboard.writeText(css);
  };

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900/50' : 'bg-black/50'} flex items-center justify-center z-50 p-4`} onClick={onClose}>
      <motion.div 
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${activeMenu ? 'w-full md:w-[70vw]' : 'w-full md:w-[400px]'} max-h-[90vh] overflow-y-auto rounded-xl shadow-lg overflow-hidden transition-all duration-300`}
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Başlık */}
        <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiSliders className="text-indigo-600" />
            Renk Düzenleyici
          </h3>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => toggleMenu('accessibility')}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors ${activeMenu === 'accessibility' ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
              title="Erişilebilirlik"
            >
              <FiEye className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : ''}`} />
            </button>
            <button
              onClick={() => toggleMenu('harmonies')}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors ${activeMenu === 'harmonies' ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
              title="Renk Harmonisi"
            >
              <FiDroplet className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : ''}`} />
            </button>
            <button
              onClick={() => toggleMenu('gradient')}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors ${activeMenu === 'gradient' ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
              title="Gradyan Oluşturucu"
            >
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" fill="url(#grad1)" />
              </svg>
            </button>
            <button
              onClick={() => toggleMenu('analysis')}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors ${activeMenu === 'analysis' ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
              title="Renk Analizi"
            >
              <FiInfo className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : ''}`} />
            </button>
            <button
              onClick={() => toggleMenu('suggestions')}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors ${activeMenu === 'suggestions' ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
              title="Palet Önerileri"
            >
              <FiGrid className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
              title="Kapat"
            >
              <FiX className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Ana içerik */}
          <div className={`${activeMenu ? 'w-full md:w-1/3' : 'w-full'} p-6 space-y-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${activeMenu ? 'border-b md:border-b-0 md:border-r' : ''}`}>
            {/* Renk Önizleme */}
            <div className="space-y-2">
              <div
                className="h-24 rounded-lg shadow-inner transition-colors"
                style={{ backgroundColor: color }}
              />
              <div className="text-center">
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{findClosestColorName(color)}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{color.toUpperCase()}</div>
              </div>
            </div>

            {/* Önceden Tanımlanmış Renkler */}
            <div className="space-y-2">
              <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Hazır Renkler</h4>
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((preColor) => (
                  <button
                    key={preColor.hex}
                    onClick={() => handlePredefinedColor(preColor.hex)}
                    className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors text-center`}
                  >
                    <div
                      className="w-full h-8 rounded mb-1"
                      style={{ backgroundColor: preColor.hex }}
                    />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{preColor.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* HSL Kontrolü */}
            <div className="space-y-4">
              {/* Ton Kontrolü */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Ton</label>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{Math.round(hsl.h)}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHslChange('hue', -10)}
                    className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <FiMinus className={isDarkMode ? 'text-gray-300' : ''} />
                  </button>
                  <div className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500 rounded" />
                  <button
                    onClick={() => handleHslChange('hue', 10)}
                    className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <FiPlus className={isDarkMode ? 'text-gray-300' : ''} />
                  </button>
                </div>
              </div>

              {/* Doygunluk Kontrolü */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Doygunluk</label>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>%{Math.round(hsl.s)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHslChange('saturation', -5)}
                    className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <FiMinus className={isDarkMode ? 'text-gray-300' : ''} />
                  </button>
                  <div className="flex-1 h-2 bg-gradient-to-r from-gray-300 to-blue-500 rounded" />
                  <button
                    onClick={() => handleHslChange('saturation', 5)}
                    className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <FiPlus className={isDarkMode ? 'text-gray-300' : ''} />
                  </button>
                </div>
              </div>

              {/* Parlaklık Kontrolü */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Parlaklık</label>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>%{Math.round(hsl.l)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHslChange('lightness', -5)}
                    className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <FiMinus className={isDarkMode ? 'text-gray-300' : ''} />
                  </button>
                  <div className="flex-1 h-2 bg-gradient-to-r from-black via-gray-300 to-white rounded" />
                  <button
                    onClick={() => handleHslChange('lightness', 5)}
                    className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <FiPlus className={isDarkMode ? 'text-gray-300' : ''} />
                  </button>
                </div>
              </div>
            </div>

            {/* Renk Değeri */}
            <button
              onClick={() => navigator.clipboard.writeText(color.toUpperCase())}
              className={`w-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} p-3 rounded-lg transition-colors text-center`}
            >
              <div className={`font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>HEX</div>
              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{color.toUpperCase()}</div>
            </button>
          </div>

          {/* Yan panel */}
          {activeMenu && (
            <div className="w-full md:w-2/3 p-6 overflow-y-auto">
              {/* Renk Harmonisi Paneli */}
              {activeMenu === 'harmonies' && (
                <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h4 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Renk Harmonisi</h4>
                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Tamamlayıcı Renk</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div 
                          className="h-12 rounded shadow-inner" 
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-xs text-center text-gray-500">{color}</div>
                      </div>
                      <div className="space-y-1">
                        <div 
                          className="h-12 rounded shadow-inner cursor-pointer hover:opacity-90 transition-opacity" 
                          style={{ backgroundColor: getComplementaryColor(color) }}
                          onClick={() => onChange(getComplementaryColor(color))}
                        />
                        <div className="text-xs text-center text-gray-500">{getComplementaryColor(color)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Analog Renkler</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {getAnalogousColors(color).map((analogColor, index) => (
                        <div key={index} className="space-y-1">
                          <div 
                            className="h-12 rounded shadow-inner cursor-pointer hover:opacity-90 transition-opacity" 
                            style={{ backgroundColor: analogColor }}
                            onClick={() => onChange(analogColor)}
                          />
                          <div className="text-xs text-center text-gray-500">{analogColor}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Üçlü Harmoni</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {getTriadicColors(color).map((triadicColor, index) => (
                        <div key={index} className="space-y-1">
                          <div 
                            className="h-12 rounded shadow-inner cursor-pointer hover:opacity-90 transition-opacity" 
                            style={{ backgroundColor: triadicColor }}
                            onClick={() => onChange(triadicColor)}
                          />
                          <div className="text-xs text-center text-gray-500">{triadicColor}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Bölünmüş Tamamlayıcı</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {getSplitComplementaryColors(color).map((splitColor, index) => (
                        <div key={index} className="space-y-1">
                          <div 
                            className="h-12 rounded shadow-inner cursor-pointer hover:opacity-90 transition-opacity" 
                            style={{ backgroundColor: splitColor }}
                            onClick={() => onChange(splitColor)}
                          />
                          <div className="text-xs text-center text-gray-500">{splitColor}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Erişilebilirlik Paneli */}
              {activeMenu === 'accessibility' && (
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <h4 className={`font-medium text-lg  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Erişilebilirlik Kontrolü</h4>
                  
                  {/* WCAG Kontrast Oranları */}
                  <div className="space-y-4">
                    <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>WCAG 2.1 Kontrast Oranları</h5>
                    
                    {/* Beyaz Arka Plan */}
                    <div className="bg-white p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Beyaz Arka Plan</span>
                        <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          calculateContrastRatio(debouncedColor, '#FFFFFF') >= 4.5 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {calculateContrastRatio(debouncedColor, '#FFFFFF')}:1 
                        </span>
                          <div className={`w-2 h-2 rounded-full ${
                            calculateContrastRatio(debouncedColor, '#FFFFFF') >= 7 ? 'bg-green-500' :
                            calculateContrastRatio(debouncedColor, '#FFFFFF') >= 4.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div style={{ color: debouncedColor }} className="text-3xl font-bold">
                          Büyük Metin Örneği
                        </div>
                        <div style={{ color: debouncedColor }} className="text-base">
                          Normal metin örneği - WCAG AA standardı için minimum 4.5:1 kontrast oranı gereklidir.
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span>AAA Seviyesi (7:1+) - Tüm metin boyutları için mükemmel</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span>AA Seviyesi (4.5:1+) - Normal metin için yeterli</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span>Başarısız - Kontrast oranı yetersiz</span>
                        </div>
                      </div>
                    </div>

                    {/* Siyah Arka Plan */}
                    <div className="bg-black p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">Siyah Arka Plan</span>
                        <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                            calculateContrastRatio(debouncedColor, '#000000') >= 4.5 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {calculateContrastRatio(debouncedColor, '#000000')}:1
                        </span>
                          <div className={`w-2 h-2 rounded-full ${
                            calculateContrastRatio(debouncedColor, '#000000') >= 7 ? 'bg-green-400' :
                            calculateContrastRatio(debouncedColor, '#000000') >= 4.5 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div style={{ color: debouncedColor }} className="text-3xl font-bold">
                          Büyük Metin Örneği
                        </div>
                        <div style={{ color: debouncedColor }} className="text-base">
                          Normal metin örneği - WCAG AA standardı için minimum 4.5:1 kontrast oranı gereklidir.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Renk Körlüğü Simülasyonları */}
                  <div className="space-y-4">
                    <h5 className={`font-medium text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Renk Körlüğü Simülasyonları</h5>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Protanopi (Kırmızı Körlüğü) */}
                      <div className="space-y-2">
                        <div className={`font-medium text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Protanopi</div>
                        <div className="relative">
                          <div
                            className="h-20 rounded-lg"
                            style={{ backgroundColor: color, filter: 'grayscale(100%) brightness(1) contrast(1)' }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                              Kırmızı Körlüğü
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Deuteranopi (Yeşil Körlüğü) */}
                      <div className="space-y-2">
                        <div className={`font-medium text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Deuteranopi</div>
                        <div className="relative">
                          <div
                            className="h-20 rounded-lg"
                            style={{ backgroundColor: color, filter: 'grayscale(100%) sepia(20%) brightness(1) contrast(1)' }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                              Yeşil Körlüğü
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tritanopi (Mavi Körlüğü) */}
                      <div className="space-y-2">
                        <div className={`font-medium text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Tritanopi</div>
                        <div className="relative">
                          <div
                            className="h-20 rounded-lg"
                            style={{ backgroundColor: color, filter: 'grayscale(100%) sepia(50%) hue-rotate(180deg)' }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                              Mavi Körlüğü
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Akromatopsi (Tam Renk Körlüğü) */}
                      <div className="space-y-2">
                        <div className={`font-medium text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Akromatopsi</div>
                        <div className="relative">
                          <div
                            className="h-20 rounded-lg"
                            style={{ backgroundColor: color, filter: 'grayscale(100%)' }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                              Tam Renk Körlüğü
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kullanım Önerileri */}
                  <div className="space-y-4">
                    <h5 className={`font-medium text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Kullanım Önerileri</h5>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
                          calculateContrastRatio(debouncedColor, '#FFFFFF') >= 4.5 ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">Açık Arka Planlarda Metin</div>
                          <div className="text-sm text-gray-600">
                        {calculateContrastRatio(debouncedColor, '#FFFFFF') >= 4.5 
                              ? 'Bu renk açık arka planlarda metin olarak kullanılabilir.'
                              : 'Bu renk açık arka planlarda metin olarak kullanılması önerilmez.'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
                          calculateContrastRatio(debouncedColor, '#000000') >= 4.5 ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">Koyu Arka Planlarda Metin</div>
                          <div className="text-sm text-gray-600">
                        {calculateContrastRatio(debouncedColor, '#000000') >= 4.5
                              ? 'Bu renk koyu arka planlarda metin olarak kullanılabilir.'
                              : 'Bu renk koyu arka planlarda metin olarak kullanılması önerilmez.'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
                          calculateContrastRatio(debouncedColor, '#FFFFFF') >= 3 ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">Büyük Metin ve UI Öğeleri</div>
                          <div className="text-sm text-gray-600">
                            {calculateContrastRatio(debouncedColor, '#FFFFFF') >= 3
                              ? 'Bu renk büyük metin ve UI öğeleri için uygundur.'
                              : 'Bu renk büyük metin ve UI öğeleri için bile yetersiz kontrasta sahip.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gradyan Oluşturucu */}
              {activeMenu === 'gradient' && (
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <h4 className={`font-medium text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Gradyan Oluşturucu</h4>

                  {/* Gradyan Önizleme */}
                  <div className="space-y-2">
                    <div
                      className="h-32 rounded-lg shadow-inner transition-all"
                      style={{ background: createGradient() }}
                    />
                    <button
                      onClick={copyGradientCSS}
                      className="w-full bg-gray-50 p-2 rounded text-sm hover:bg-gray-100 transition-colors"
                    >
                      CSS Kodunu Kopyala
                    </button>
                  </div>

                  {/* Gradyan Tipi */}
                  <div className="space-y-2">
                    <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Gradyan Tipi</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setGradientType('linear')}
                        className={`p-2 rounded text-sm ${gradientType === 'linear' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        Linear
                      </button>
                      <button
                        onClick={() => setGradientType('radial')}
                        className={`p-2 rounded text-sm ${gradientType === 'radial' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        Radial
                      </button>
                      <button
                        onClick={() => setGradientType('conic')}
                        className={`p-2 rounded text-sm ${gradientType === 'conic' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        Conic
                      </button>
                    </div>
                  </div>

                  {/* Gradyan Ayarları */}
                  <div className="space-y-4">
                    {(gradientType === 'linear' || gradientType === 'conic') && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Açı</label>
                          <span className="text-sm text-gray-500">{gradientAngle}°</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setGradientAngle(Math.max(0, gradientAngle - 45))}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiMinus />
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(Number(e.target.value))}
                            className="flex-1"
                          />
                          <button
                            onClick={() => setGradientAngle(Math.min(360, gradientAngle + 45))}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    )}

                    {gradientType === 'radial' && (
                      <div className="space-y-2">
                        <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Şekil</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setGradientShape('circle')}
                            className={`p-2 rounded text-sm ${gradientShape === 'circle' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                          >
                            Daire
                          </button>
                          <button
                            onClick={() => setGradientShape('ellipse')}
                            className={`p-2 rounded text-sm ${gradientShape === 'ellipse' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                          >
                            Elips
                          </button>
                        </div>
                      </div>
                    )}

                    {/* İkinci Renk Seçimi */}
                    <div className="space-y-2">
                      <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>İkinci Renk</h5>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          gradientColor2,
                          getComplementaryColor(color),
                          ...getAnalogousColors(color)
                        ].map((suggestedColor, index) => (
                          <button
                            key={index}
                            onClick={() => setGradientColor2(suggestedColor)}
                            className="p-1 rounded hover:opacity-90 transition-opacity"
                          >
                            <div
                              className="w-full h-8 rounded"
                              style={{ backgroundColor: suggestedColor }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hazır Gradyanlar */}
                  <div className="space-y-4">
                    <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Hazır Gradyanlar</h5>
                    <div className="space-y-4">
                      {Object.entries(getGradientPresets(color)).map(([type, gradients]) => (
                        <div key={type} className="space-y-2">
                          <h6 className={`text-xs font-medium capitalize ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{type}</h6>
                          <div className="grid grid-cols-2 gap-2">
                            {gradients.map((gradient, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  const colors = gradient.match(/#[a-f\d]{6}/gi);
                                  if (colors && colors.length >= 2) {
                                    setGradientColor2(colors[1]);
                                    setGradientType(gradient.includes('linear') ? 'linear' : 
                                                  gradient.includes('radial') ? 'radial' : 'conic');
                                  }
                                }}
                                className="p-1 rounded hover:opacity-90 transition-opacity"
                              >
                                <div
                                  className="w-full h-16 rounded"
                                  style={{ background: gradient }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Renk Analizi */}
              {activeMenu === 'analysis' && (
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <h4 className={`text-lg font-medium capitalize ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Renk Analizi</h4>
                  
                  {(() => {
                    const analysis = getColorAnalysis(color);
                    return (
                      <div className="space-y-6">
                        {/* Renk Karakteristiği */}
                        <div className="space-y-4">
                          <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Renk Karakteristiği</h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-sm font-medium mb-1">Sıcaklık</div>
                              <div className="text-sm text-gray-600">{analysis.characteristics.temperature}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-sm font-medium mb-1">Yoğunluk</div>
                              <div className="text-sm text-gray-600">{analysis.characteristics.intensity}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-sm font-medium mb-1">Parlaklık</div>
                              <div className="text-sm text-gray-600">{analysis.characteristics.brightness}</div>
                            </div>
                          </div>
                        </div>

                        {/* Psikolojik Etkiler */}
                        <div className="space-y-4">
                          <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Psikolojik Etkiler</h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Olumlu Etkiler</div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex flex-wrap gap-1">
                                  {analysis.psychology.effects.map((effect, index) => (
                                    <span key={index} className="text-xs bg-white px-2 py-1 rounded">
                                      {effect}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Duygusal Etkiler</div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex flex-wrap gap-1">
                                  {analysis.psychology.emotions.map((emotion, index) => (
                                    <span key={index} className="text-xs bg-white px-2 py-1 rounded">
                                      {emotion}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Olumsuz Etkiler</div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex flex-wrap gap-1">
                                  {analysis.psychology.negatives.map((negative, index) => (
                                    <span key={index} className="text-xs bg-white px-2 py-1 rounded text-red-600">
                                      {negative}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Endüstri Kullanımı */}
                        <div className="space-y-4">
                          <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Endüstri Kullanımı</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-wrap gap-2">
                              {analysis.industries.map((industry, index) => (
                                <div key={index} className="bg-white px-3 py-2 rounded-full text-sm">
                                  {industry}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Renk Bilgisi */}
                        <div className="space-y-4">
                          <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Renk Bilgisi</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-16 h-16 rounded-lg shadow-inner"
                                style={{ backgroundColor: color }}
                              />
                              <div>
                                <div className="font-medium">{analysis.name}</div>
                                <div className="text-sm text-gray-600">{color.toUpperCase()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Palet Önerileri */}
              {activeMenu === 'suggestions' && (
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <h4 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Palet Önerileri</h4>
                  <div className="space-y-8">
                    {Object.entries(generateColorPalettes(color)).map(([key, palette]) => (
                      <div key={key} className="space-y-4">
                        <div>
                          <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{palette.name}</h5>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-800'}`}>{palette.description}</p>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {palette.colors.map((paletteColor, index) => (
                            <button
                              key={index}
                              onClick={() => onChange(paletteColor)}
                              className="group relative"
                            >
                              <div
                                className="h-16 rounded-lg shadow-inner transition-transform group-hover:scale-105"
                                style={{ backgroundColor: paletteColor }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {paletteColor.toUpperCase()}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="h-20 rounded-lg shadow-inner"
                            style={{
                              background: `linear-gradient(to right, ${palette.colors.join(', ')})`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ColorEditorNew; 