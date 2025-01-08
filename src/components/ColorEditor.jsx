import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSliders, FiRotateCcw, FiCopy, FiCheck, FiClock, FiDroplet, FiEye, FiX } from 'react-icons/fi';
import { hexToRgb, rgbToHsl, hslToHex, rgbToHex, getColorHarmonies, getContrastYIQ } from '../utils/colorUtils';
import { findClosestColorName } from '../utils/colorNames';
import toast from 'react-hot-toast';

const MAX_HISTORY = 10;

const ColorEditor = ({ color, onChange, onComplete }) => {
  const [rgb, setRgb] = useState(hexToRgb(color));
  const [hsl, setHsl] = useState(rgbToHsl(rgb.r, rgb.g, rgb.b));
  const [copied, setCopied] = useState(false);
  const [originalColor] = useState(color);
  const [colorHistory, setColorHistory] = useState(() => {
    const saved = localStorage.getItem('colorHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showHistory, setShowHistory] = useState(false);
  const [showHarmonies, setShowHarmonies] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  
  const [hue, setHue] = useState(hsl.h);
  const [saturation, setSaturation] = useState(hsl.s);
  const [lightness, setLightness] = useState(hsl.l);

  useEffect(() => {
    const newColor = hslToHex(hue, saturation, lightness);
    setRgb(hexToRgb(newColor));
  }, [hue, saturation, lightness]);

  useEffect(() => {
    const newRgb = hexToRgb(color);
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setRgb(newRgb);
    setHue(newHsl.h);
    setSaturation(newHsl.s);
    setLightness(newHsl.l);
  }, [color]);

  useEffect(() => {
    localStorage.setItem('colorHistory', JSON.stringify(colorHistory));
  }, [colorHistory]);

  const addToHistory = (newColor) => {
    setColorHistory(prev => {
      const filtered = prev.filter(c => c !== newColor);
      return [newColor, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgb, [channel]: value };
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setRgb(newRgb);
    setHue(newHsl.h);
    setSaturation(newHsl.s);
    setLightness(newHsl.l);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    onChange(newColor);
  };

  const handleSliderComplete = () => {
    const currentColor = hslToHex(hue, saturation, lightness);
    addToHistory(currentColor);
    toast.success('Renk güncellendi');
  };

  const selectHistoryColor = (historicColor) => {
    const rgb = hexToRgb(historicColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setRgb(rgb);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    onChange(historicColor);
    setShowHistory(false);
  };

  const resetColor = () => {
    const rgb = hexToRgb(originalColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setRgb(rgb);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    onChange(originalColor);
    addToHistory(originalColor);
    toast.success('Renk sıfırlandı');
  };

  const copyToClipboard = async (format) => {
    let textToCopy = '';
    switch (format) {
      case 'hex':
        textToCopy = color.toUpperCase();
        break;
      case 'rgb':
        textToCopy = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        break;
      case 'hsl':
        textToCopy = `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`;
        break;
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Renk kopyalandı');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Renk kopyalanamadı');
    }
  };

  const selectHarmonyColor = (harmonyColor) => {
    const rgb = hexToRgb(harmonyColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setRgb(rgb);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    onChange(harmonyColor);
    setShowHarmonies(false);
    addToHistory(harmonyColor);
  };

  const calculateContrastRatio = (color1, color2) => {
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return Math.round(ratio * 100) / 100;
  };

  const getWCAGLevel = (ratio) => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA (Büyük Metin)';
    return 'Başarısız';
  };

  const handleClose = () => {
    setShowAccessibility(false);
    setShowHarmonies(false);
    setShowHistory(false);
    
    const finalColor = hslToHex(hue, saturation, lightness);
    onChange(finalColor);
    onComplete();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAccessibility(false);
      setShowHarmonies(false);
      setShowHistory(false);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className={`bg-gray-50 ${showAccessibility || showHarmonies || showHistory ? 'w-[70%]' : 'w-[400px]'} max-h-[90vh] rounded-xl overflow-y-auto transition-all duration-300`} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Üst Bar */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FiSliders className="text-indigo-600" />
              Renk Düzenleyici
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAccessibility(!showAccessibility)}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${showAccessibility ? 'bg-gray-100' : ''}`}
                  title="Erişilebilirlik"
                >
                  <FiEye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowHarmonies(!showHarmonies)}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${showHarmonies ? 'bg-gray-100' : ''}`}
                  title="Renk Harmonisi"
                >
                  <FiDroplet className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors relative ${showHistory ? 'bg-gray-100' : ''}`}
                  title="Renk Geçmişi"
                >
                  <FiClock className="w-5 h-5" />
                  {colorHistory.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {colorHistory.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={resetColor}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Rengi Sıfırla"
                >
                  <FiRotateCcw className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Kapat"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className={`${showAccessibility || showHarmonies || showHistory ? 'flex gap-6' : ''}`}>
            {/* Sol Panel - Renk Düzenleyici */}
            <div className={`${showAccessibility || showHarmonies || showHistory ? 'flex-1 min-w-0' : ''} space-y-6`}>
              {/* Renk Önizleme */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-2">
                  <div
                    className="h-24 rounded-lg shadow-inner relative group"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => copyToClipboard('hex')}
                        className="bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
                        title="Renk kodunu kopyala"
                      >
                        {copied ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium text-gray-600">
                    {findClosestColorName(color)}
                  </div>
                </div>
              </div>

              {/* Renk Kontrolleri */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* RGB Kontrolü */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Kırmızı (R)</label>
                      <span className="text-sm text-gray-500">{rgb.r}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.r}
                      onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                      onMouseUp={handleSliderComplete}
                      onTouchEnd={handleSliderComplete}
                      className="w-full h-2 bg-gradient-to-r from-black to-red-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Yeşil (G)</label>
                      <span className="text-sm text-gray-500">{rgb.g}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.g}
                      onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                      onMouseUp={handleSliderComplete}
                      onTouchEnd={handleSliderComplete}
                      className="w-full h-2 bg-gradient-to-r from-black to-green-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Mavi (B)</label>
                      <span className="text-sm text-gray-500">{rgb.b}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.b}
                      onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                      onMouseUp={handleSliderComplete}
                      onTouchEnd={handleSliderComplete}
                      className="w-full h-2 bg-gradient-to-r from-black to-blue-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* HSL Kontrolü */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Ton</label>
                      <span className="text-sm text-gray-500">{Math.round(hue)}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={hue}
                      onChange={(e) => setHue(Number(e.target.value))}
                      onMouseUp={handleSliderComplete}
                      onTouchEnd={handleSliderComplete}
                      className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Doygunluk</label>
                      <span className="text-sm text-gray-500">%{Math.round(saturation)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      onMouseUp={handleSliderComplete}
                      onTouchEnd={handleSliderComplete}
                      className="w-full h-2 bg-gradient-to-r from-gray-300 to-blue-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Parlaklık</label>
                      <span className="text-sm text-gray-500">%{Math.round(lightness)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightness}
                      onChange={(e) => setLightness(Number(e.target.value))}
                      onMouseUp={handleSliderComplete}
                      onTouchEnd={handleSliderComplete}
                      className="w-full h-2 bg-gradient-to-r from-black via-gray-300 to-white rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Renk Değerleri */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <button
                    onClick={() => copyToClipboard('hex')}
                    className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="font-medium mb-1 flex items-center justify-between">
                      HEX
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-gray-600">{color.toUpperCase()}</div>
                  </button>
                  <button
                    onClick={() => copyToClipboard('rgb')}
                    className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="font-medium mb-1 flex items-center justify-between">
                      RGB
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-gray-600">
                      {rgb.r}, {rgb.g}, {rgb.b}
                    </div>
                  </button>
                  <button
                    onClick={() => copyToClipboard('hsl')}
                    className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="font-medium mb-1 flex items-center justify-between">
                      HSL
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-gray-600">
                      {Math.round(hue)}°, {Math.round(saturation)}%, {Math.round(lightness)}%
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sağ Panel - Yan Menüler */}
            {(showAccessibility || showHarmonies || showHistory) && (
              <div className="w-[480px] space-y-4">
                {showAccessibility && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Erişilebilirlik</h4>
                      <button
                        onClick={() => setShowAccessibility(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Kapat"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {/* Beyaz Arka Plan Üzerinde */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Beyaz Arka Plan</span>
                          <span className={`text-sm font-medium ${
                            calculateContrastRatio(color, '#FFFFFF') >= 4.5 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {calculateContrastRatio(color, '#FFFFFF')}:1 
                            ({getWCAGLevel(calculateContrastRatio(color, '#FFFFFF'))})
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded border flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                          <span style={{ color: color }}>
                            Örnek metin
                          </span>
                        </div>
                      </div>

                      {/* Siyah Arka Plan Üzerinde */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Siyah Arka Plan</span>
                          <span className={`text-sm font-medium ${
                            calculateContrastRatio(color, '#000000') >= 4.5 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {calculateContrastRatio(color, '#000000')}:1
                            ({getWCAGLevel(calculateContrastRatio(color, '#000000'))})
                          </span>
                        </div>
                        <div className="bg-black p-3 rounded border flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                          <span style={{ color: color }}>
                            Örnek metin
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Renk Körlüğü Simülasyonu */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Renk Körlüğü Simülasyonu</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm mb-2">Protanopi (Kırmızı Körlüğü)</div>
                          <div
                            className="h-16 rounded"
                            style={{
                              backgroundColor: color,
                              filter: 'grayscale(100%) brightness(1) contrast(1)'
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-sm mb-2">Deuteranopi (Yeşil Körlüğü)</div>
                          <div
                            className="h-16 rounded"
                            style={{
                              backgroundColor: color,
                              filter: 'grayscale(100%) sepia(20%) brightness(1) contrast(1)'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Kullanım Önerileri */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Kullanım Önerileri</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full ${
                            calculateContrastRatio(color, '#FFFFFF') >= 4.5 ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          {calculateContrastRatio(color, '#FFFFFF') >= 4.5 
                            ? 'Bu renk açık arka planlarda metin olarak kullanılabilir'
                            : 'Bu renk açık arka planlarda metin olarak kullanılması önerilmez'}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full ${
                            calculateContrastRatio(color, '#000000') >= 4.5 ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          {calculateContrastRatio(color, '#000000') >= 4.5
                            ? 'Bu renk koyu arka planlarda metin olarak kullanılabilir'
                            : 'Bu renk koyu arka planlarda metin olarak kullanılması önerilmez'}
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {showHarmonies && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Renk Harmonisi</h4>
                      <button
                        onClick={() => setShowHarmonies(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Kapat"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className={`font-medium mb-2 text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Tamamlayıcı Renk</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => selectHarmonyColor(getColorHarmonies(color).complementary)}
                            className="w-8 h-8 rounded-full shadow-md hover:scale-110 transition-transform"
                            style={{ backgroundColor: getColorHarmonies(color).complementary }}
                            title="Tamamlayıcı Renk"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium mb-2 text-sm">Üçlü Harmoni</div>
                        <div className="flex gap-2">
                          {getColorHarmonies(color).triadic.map((triadicColor, index) => (
                            <button
                              key={index}
                              onClick={() => selectHarmonyColor(triadicColor)}
                              className="w-8 h-8 rounded-full shadow-md hover:scale-110 transition-transform"
                              style={{ backgroundColor: triadicColor }}
                              title="Üçlü Harmoni"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className={`font-medium mb-2 text-sm  ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Analog Renkler</div>
                        <div className="flex gap-2">
                          {getColorHarmonies(color).analogous.map((analogousColor, index) => (
                            <button
                              key={index}
                              onClick={() => selectHarmonyColor(analogousColor)}
                              className="w-8 h-8 rounded-full shadow-md hover:scale-110 transition-transform"
                              style={{ backgroundColor: analogousColor }}
                              title="Analog Renk"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showHistory && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Renk Geçmişi</h4>
                      <button
                        onClick={() => setShowHistory(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Kapat"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {colorHistory.map((historicColor, index) => (
                        <button
                          key={index}
                          onClick={() => selectHistoryColor(historicColor)}
                          className="w-8 h-8 rounded-full shadow-md hover:scale-110 transition-transform"
                          style={{ backgroundColor: historicColor }}
                          title={historicColor.toUpperCase()}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorEditor; 