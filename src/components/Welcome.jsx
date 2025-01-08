import React from 'react';
import { motion } from 'framer-motion';

const Welcome = ({ onComplete, darkMode }) => {
  const colors = [
    'from-[#FF6B6B] to-[#FF8E8E]',
    'from-[#4ECDC4] to-[#6EE7E7]',
    'from-[#FFD93D] to-[#FFE869]',
    'from-[#6C63FF] to-[#837DFF]',
    'from-[#FF75C3] to-[#FFA4D4]'
  ];

  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center ${
        darkMode ? 'bg-[#1a1c1e]' : 'bg-gray-900'
      } overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Arka plan animasyonu */}
      <div className={`absolute inset-0 ${darkMode ? 'opacity-10' : 'opacity-20'}`}>
        {colors.map((gradient, index) => (
          <motion.div
            key={gradient}
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [1.5, 1, 1.5],
              rotate: [0, 90, 180]
            }}
            transition={{
              duration: 3,
              delay: index * 0.2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Ana içerik */}
      <div className="relative z-10">
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <div className="flex gap-3 mb-6">
              {colors.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-6 h-24 rounded-full ${darkMode ? 'bg-gray-100' : 'bg-white'}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: [0, 1.5, 1] }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  style={{
                    transformOrigin: "bottom"
                  }}
                />
              ))}
            </div>
            <motion.h1
              className={`text-7xl font-bold mb-4 tracking-tight ${
                darkMode ? 'text-gray-100' : 'text-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              G-Color
            </motion.h1>
          </motion.div>
          
          <motion.p
            className={`text-xl max-w-md mx-auto mb-12 ${
              darkMode ? 'text-gray-400' : 'text-gray-300'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Renk paletleri oluşturmanın en modern ve yaratıcı yolu
          </motion.p>

          <motion.button
            onClick={onComplete}
            className={`px-8 py-4 rounded-full font-semibold text-lg
                     transform hover:scale-105 transition-all duration-200
                     shadow-lg hover:shadow-xl ${
                       darkMode 
                         ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700'
                         : 'bg-white text-gray-900 hover:bg-opacity-90'
                     }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Hemen Başla
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Welcome; 