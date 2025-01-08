import { useState, useEffect } from 'react'
import Welcome from './components/Welcome'
import ColorPalette from './components/ColorPalette'
import SavedPalettesModal from './components/SavedPalettesModal'
import { PaletteProvider } from './context/PaletteContext'
import { FiMoon, FiSun, FiFolder } from 'react-icons/fi'
import { Toaster } from 'react-hot-toast'

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showSavedPalettes, setShowSavedPalettes] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <PaletteProvider>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#ffffff' : '#1f2937',
            },
            duration: 2000,
          }}
        />
        {showWelcome ? (
          <Welcome onComplete={() => setShowWelcome(false)} />
        ) : (
          <div className="min-h-screen">
            <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-200`}>
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    G-Color
                  </h1>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowSavedPalettes(true)}
                      className={`p-2 rounded-full transition-colors
                        ${darkMode 
                          ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                    >
                      <FiFolder className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`p-2 rounded-full transition-colors
                        ${darkMode 
                          ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                    >
                      {darkMode ? (
                        <FiSun className="w-5 h-5" />
                      ) : (
                        <FiMoon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <main>
              <ColorPalette darkMode={darkMode} />
            </main>
          </div>
        )}
        <SavedPalettesModal
          isOpen={showSavedPalettes}
          onClose={() => setShowSavedPalettes(false)}
        />
      </div>
    </PaletteProvider>
  )
}

export default App
