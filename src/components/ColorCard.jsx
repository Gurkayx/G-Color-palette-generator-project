import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiLock, FiUnlock, FiRefreshCw, FiCopy, FiSliders } from 'react-icons/fi';
import { hexToRgb, hexToHSL } from '../utils/colorUtils';
import ColorEditorNew from './ColorEditorNew';
import toast from 'react-hot-toast';

const ColorCard = ({ color, isLocked, onToggleLock, onColorChange, darkMode }) => {
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const windowWidth = window.innerWidth;
      const menuWidth = 288;
      const padding = 16;
      
      const hasSpaceOnLeft = rect.left > menuWidth + padding;
      const hasSpaceOnRight = windowWidth - rect.right > menuWidth + padding;
      
      let left, transform;
      
      if (hasSpaceOnLeft) {
        left = rect.left - 10;
        transform = 'translate(-100%, -50%)';
      } else if (hasSpaceOnRight) {
        left = rect.right + 10;
        transform = 'translate(0, -50%)';
      } else {
        left = windowWidth / 2;
        transform = 'translate(-50%, -50%)';
      }
      
      setMenuPosition({
        top: rect.top + scrollY + (rect.height / 2),
        left,
        transform,
        position: hasSpaceOnLeft ? 'left' : hasSpaceOnRight ? 'right' : 'center'
      });
    }
  };

  useEffect(() => {
    if (showCopyMenu) {
      updateMenuPosition();
      window.addEventListener('scroll', updateMenuPosition);
      window.addEventListener('resize', updateMenuPosition);
      
      // Dışarı tıklamayı dinle
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) &&
            cardRef.current && !cardRef.current.contains(event.target)) {
          setShowCopyMenu(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('scroll', updateMenuPosition);
        window.removeEventListener('resize', updateMenuPosition);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCopyMenu]);

  const copyToClipboard = (format) => {
    let textToCopy = color;

    if (format === 'rgb') {
      const rgb = hexToRgb(color);
      textToCopy = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    } else if (format === 'hsl') {
      const hsl = hexToHSL(color);
      textToCopy = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }

    navigator.clipboard.writeText(textToCopy);
    toast.success(`${format.toUpperCase()} formatında kopyalandı`);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowCopyMenu(!showCopyMenu);
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        className={`relative group rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="aspect-square cursor-pointer relative"
          style={{ backgroundColor: color }}
          onClick={toggleMenu}
        />

        <div className={`p-3 flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <button
            onClick={onToggleLock}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title={isLocked ? 'Kilidi Aç' : 'Kilitle'}
          >
            {isLocked ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
          </button>

          <span className="font-mono text-sm">{color.toUpperCase()}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onColorChange();
            }}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Yeni Renk"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {showCopyMenu && createPortal(
        <div 
          ref={menuRef}
          className="fixed z-[9999] w-72"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            transform: menuPosition.transform
          }}
        >
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div
                className="w-full h-32 rounded-lg shadow-inner mb-3"
                style={{ backgroundColor: color }}
              />
              <div className="text-center">
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {color.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="p-2 space-y-1">
              <button
                onClick={() => copyToClipboard('hex')}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FiCopy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex justify-between w-full">
                  <span>HEX</span>
                  <span className={`font-mono ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {color.toUpperCase()}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => copyToClipboard('rgb')}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FiCopy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex justify-between w-full">
                  <span>RGB</span>
                  <span className={`font-mono ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {`rgb(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b})`}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => copyToClipboard('hsl')}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FiCopy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex justify-between w-full">
                  <span>HSL</span>
                  <span className={`font-mono ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {`hsl(${Math.round(hexToHSL(color).h)}, ${Math.round(hexToHSL(color).s)}%, ${Math.round(hexToHSL(color).l)}%)`}
                  </span>
                </div>
              </button>
            </div>
            
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
            
            <div className="p-2">
              <button
                onClick={() => {
                  setShowCopyMenu(false);
                  setShowEditor(true);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FiSliders className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span>Rengi Düzenle</span>
              </button>
            </div>
          </div>
          
          {menuPosition.position !== 'center' && (
            <div 
              className={`absolute top-1/2 -translate-y-1/2 ${
                menuPosition.position === 'left' 
                  ? 'right-0 translate-x-full' 
                  : 'left-0 -translate-x-full'
              }`}
            >
              <div 
                className={`w-4 h-4 transform ${
                  menuPosition.position === 'left' ? 'rotate-45' : '-rotate-45'
                } shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              />
            </div>
          )}
        </div>,
        document.body
      )}

      {showEditor && (
        <ColorEditorNew
          color={color}
          onChange={onColorChange}
          onClose={() => setShowEditor(false)}
          isDarkMode={darkMode}
        />
      )}
    </>
  );
};

export default ColorCard; 