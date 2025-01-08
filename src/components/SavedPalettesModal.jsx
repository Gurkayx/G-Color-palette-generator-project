import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { usePalette } from '../context/PaletteContext';
import toast from 'react-hot-toast';

const SavedPalettesModal = ({ isOpen, onClose, darkMode }) => {
  const { savedPalettes, deletePalette } = usePalette();

  if (!isOpen) return null;

  const handleDelete = (palette) => {
    deletePalette(palette.id);
    toast.success('Palet başarıyla silindi');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        className={`${
          darkMode ? 'bg-[#1a1c1e]' : 'bg-white'
        } rounded-xl shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className={`sticky top-0 p-4 sm:p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} bg-inherit z-10`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Kaydedilen Paletler
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`p-4 sm:p-6 ${darkMode ? 'bg-[#1a1c1e]' : 'bg-white'}`}>
          {savedPalettes.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Henüz kaydedilmiş palet yok
            </div>
          ) : (
            <div className="grid gap-4">
              {savedPalettes.map((palette) => (
                <motion.div
                  key={palette.id}
                  className={`${
                    darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                  } p-4 rounded-lg transition-colors`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} break-all`}>
                      {palette.name}
                    </h3>
                    <button
                      onClick={() => handleDelete(palette)}
                      className={`p-1.5 rounded-full transition-colors flex-shrink-0 ml-2 ${
                        darkMode ? 'hover:bg-gray-700/80 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:flex gap-2">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-full h-12 rounded shadow-inner transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                        <div className="opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center h-full">
                          <span className={`${
                            darkMode ? 'bg-black/70' : 'bg-black/50'
                          } text-white text-xs px-2 py-1 rounded truncate max-w-[90%]`}>
                            {color.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SavedPalettesModal; 