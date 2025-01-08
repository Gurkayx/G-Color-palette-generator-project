// HEX'ten RGB'ye dönüşüm
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// RGB'den HEX'e dönüşüm
export const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// RGB'den HSL'ye dönüşüm
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Renk harmonisi fonksiyonları
export const getColorHarmonies = (hex) => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Tamamlayıcı renk (Complementary)
  const complementary = (hsl.h + 180) % 360;

  // Üçlü harmoni (Triadic)
  const triadic1 = (hsl.h + 120) % 360;
  const triadic2 = (hsl.h + 240) % 360;

  // Analog renkler
  const analogous1 = (hsl.h + 30) % 360;
  const analogous2 = (hsl.h - 30 + 360) % 360;

  return {
    complementary: hslToHex(complementary, hsl.s, hsl.l),
    triadic: [
      hslToHex(triadic1, hsl.s, hsl.l),
      hslToHex(triadic2, hsl.s, hsl.l)
    ],
    analogous: [
      hslToHex(analogous1, hsl.s, hsl.l),
      hslToHex(analogous2, hsl.s, hsl.l)
    ]
  };
};

// HSL'den HEX'e dönüşüm
export const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Renk kontrastını kontrol etme
export const getContrastYIQ = (hexcolor) => {
  const rgb = hexToRgb(hexcolor);
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return yiq >= 128 ? 'black' : 'white';
};

// Rastgele renk oluşturma
export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Renk formatını dönüştürme
export const convertColorFormat = (color, format) => {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  switch (format) {
    case 'hex':
      return color.toUpperCase();
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'hsl':
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    default:
      return color;
  }
};

// Renk manipülasyonu fonksiyonları
export const adjustBrightness = (hex, percent) => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newLightness = Math.max(0, Math.min(100, hsl.l + percent));
  return hslToHex(hsl.h, hsl.s, newLightness);
};

export const adjustWarmth = (hex, percent) => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newHue = (hsl.h + percent) % 360;
  return hslToHex(newHue, hsl.s, hsl.l);
};

export const applyFilter = (hex, filter) => {
  const rgb = hexToRgb(hex);
  let { r, g, b } = rgb;

  switch (filter) {
    case 'sepia':
      // Sepia filtresi
      r = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      g = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      b = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      break;
    case 'grayscale':
      // Gri tonlama
      const gray = (r + g + b) / 3;
      r = g = b = gray;
      break;
    case 'invert':
      // Renkleri tersine çevirme
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
      break;
    case 'saturate':
      // Doygunluğu artırma
      const hsl = rgbToHsl(r, g, b);
      return hslToHex(hsl.h, Math.min(100, hsl.s * 1.5), hsl.l);
    case 'desaturate':
      // Doygunluğu azaltma
      const hsl2 = rgbToHsl(r, g, b);
      return hslToHex(hsl2.h, Math.max(0, hsl2.s * 0.7), hsl2.l);
  }

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
};

// HSL renk formatına dönüştürme
export const hexToHSL = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// HSL'den HEX'e dönüştürme
export const HSLToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const rgb = [f(0), f(8), f(4)].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  });
  
  return '#' + rgb.join('');
};

// Renk harmonisi fonksiyonları
export const getComplementaryColor = (hex) => {
  const hsl = hexToHSL(hex);
  const complementaryHue = (hsl.h + 180) % 360;
  return HSLToHex(complementaryHue, hsl.s, hsl.l);
};

export const getAnalogousColors = (hex) => {
  const hsl = hexToHSL(hex);
  return [
    HSLToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hex,
    HSLToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
  ];
};

export const getTriadicColors = (hex) => {
  const hsl = hexToHSL(hex);
  return [
    hex,
    HSLToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    HSLToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
  ];
};

export const getSplitComplementaryColors = (hex) => {
  const hsl = hexToHSL(hex);
  return [
    hex,
    HSLToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
    HSLToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
  ];
};

// Kontrast oranı hesaplama
export const calculateContrastRatio = (color1, color2) => {
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

// Gradyan yardımcı fonksiyonları
export const createLinearGradient = (color1, color2, angle = 90) => {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

export const createRadialGradient = (color1, color2, shape = 'circle') => {
  return `radial-gradient(${shape} at center, ${color1}, ${color2})`;
};

export const createConicGradient = (color1, color2, angle = 0) => {
  return `conic-gradient(from ${angle}deg, ${color1}, ${color2})`;
};

export const getGradientPresets = (color) => {
  const complementary = getComplementaryColor(color);
  const analogous = getAnalogousColors(color);
  
  return {
    monochromatic: [
      createLinearGradient(color, adjustBrightness(color, -30)),
      createLinearGradient(color, adjustBrightness(color, 30)),
      createRadialGradient(color, adjustBrightness(color, -30)),
      createConicGradient(color, adjustBrightness(color, -30))
    ],
    complementary: [
      createLinearGradient(color, complementary),
      createRadialGradient(color, complementary),
      createConicGradient(color, complementary)
    ],
    analogous: [
      createLinearGradient(analogous[0], analogous[2]),
      createRadialGradient(analogous[0], analogous[2]),
      createConicGradient(analogous[0], analogous[2])
    ]
  };
};

// Gradyan CSS kodu oluşturma
export const getGradientCSS = (gradient) => {
  return `background: ${gradient};`;
};

// Renk isimleri ve HEX kodları
const colorNames = {
  // Kırmızı tonları
  'kırmızı': '#FF0000',
  'koyu kırmızı': '#8B0000',
  'bordo': '#800000',
  'kiremit': '#B22222',
  'mercan': '#FF7F50',

  // Mavi tonları
  'mavi': '#0000FF',
  'açık mavi': '#87CEEB',
  'koyu mavi': '#00008B',
  'gece mavisi': '#191970',
  'deniz mavisi': '#4169E1',

  // Yeşil tonları
  'yeşil': '#008000',
  'açık yeşil': '#90EE90',
  'koyu yeşil': '#006400',
  'zümrüt yeşili': '#2E8B57',
  'çimen yeşili': '#32CD32',

  // Sarı tonları
  'sarı': '#FFFF00',
  'altın sarısı': '#FFD700',
  'limon sarısı': '#FAFAD2',
  'hardal': '#DAA520',

  // Mor tonları
  'mor': '#800080',
  'eflatun': '#DDA0DD',
  'koyu mor': '#4B0082',
  'leylak': '#9370DB',

  // Turuncu tonları
  'turuncu': '#FFA500',
  'koyu turuncu': '#FF8C00',
  'şeftali': '#FFDAB9',

  // Pembe tonları
  'pembe': '#FFC0CB',
  'açık pembe': '#FFB6C1',
  'koyu pembe': '#FF69B4',
  'magenta': '#FF00FF',

  // Kahverengi tonları
  'kahverengi': '#A52A2A',
  'açık kahve': '#DEB887',
  'koyu kahve': '#8B4513',
  'çikolata': '#D2691E',

  // Gri tonları
  'gri': '#808080',
  'açık gri': '#D3D3D3',
  'koyu gri': '#696969',
  'kurşuni': '#778899',

  // Diğer renkler
  'beyaz': '#FFFFFF',
  'siyah': '#000000',
  'bej': '#F5F5DC',
  'krem': '#FFFDD0',
  'turkuaz': '#40E0D0',
  'lacivert': '#000080'
};

// Renk karşılaştırma fonksiyonu
const compareColors = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
};

// En yakın renk ismini bulma
export const findClosestColorName = (hexColor) => {
  let minDistance = Infinity;
  let closestColorName = 'gri'; // varsayılan

  Object.entries(colorNames).forEach(([name, hex]) => {
    const distance = compareColors(hexColor, hex);
    if (distance < minDistance) {
      minDistance = distance;
      closestColorName = name;
    }
  });

  return closestColorName;
};

// Renk analizi fonksiyonları
export const getColorAnalysis = (color) => {
  const colorName = findClosestColorName(color);
  const hsl = hexToHSL(color);
  
  // Renk sıcaklığı
  const isWarm = (hsl.h >= 0 && hsl.h <= 60) || (hsl.h >= 300 && hsl.h <= 360);
  const temperature = isWarm ? 'Sıcak' : 'Soğuk';

  // Renk yoğunluğu
  const intensity = hsl.s > 70 ? 'Canlı' : hsl.s > 30 ? 'Orta' : 'Pastel';

  // Renk parlaklığı
  const brightness = hsl.l > 70 ? 'Açık' : hsl.l < 30 ? 'Koyu' : 'Orta';

  // Psikolojik etkiler
  const psychology = {
    red: {
      effects: ['Enerji', 'Tutku', 'Heyecan', 'Güç'],
      emotions: ['Canlılık', 'Dinamizm', 'Hareketlilik'],
      negatives: ['Saldırganlık', 'Tehlike', 'Stres']
    },
    blue: {
      effects: ['Güven', 'Huzur', 'Profesyonellik', 'Derinlik'],
      emotions: ['Sakinlik', 'Güvenilirlik', 'Sadakat'],
      negatives: ['Mesafelilik', 'Soğukluk']
    },
    green: {
      effects: ['Doğallık', 'Büyüme', 'Harmoni', 'Denge'],
      emotions: ['Tazelik', 'Huzur', 'Sağlık'],
      negatives: ['Monotonluk', 'Durağanlık']
    },
    yellow: {
      effects: ['Optimizm', 'Neşe', 'Yaratıcılık', 'Enerji'],
      emotions: ['Mutluluk', 'Pozitiflik', 'Aydınlık'],
      negatives: ['Kaygı', 'Rahatsız Edicilik']
    },
    purple: {
      effects: ['Lüks', 'Asalet', 'Yaratıcılık', 'Gizem'],
      emotions: ['Zenginlik', 'İhtişam', 'Mistik'],
      negatives: ['Yapaylık', 'Gösteriş']
    },
    orange: {
      effects: ['Eğlence', 'Sosyallik', 'Özgüven', 'Macera'],
      emotions: ['Sıcaklık', 'Dostluk', 'Neşe'],
      negatives: ['Dürtüsellik', 'Yüzeysellik']
    },
    pink: {
      effects: ['Romantizm', 'Şefkat', 'Naiflik', 'Sevgi'],
      emotions: ['Yumuşaklık', 'Hassasiyet', 'Nezaket'],
      negatives: ['Zayıflık', 'Çocuksuluk']
    },
    brown: {
      effects: ['Doğallık', 'Güvenilirlik', 'Sağlamlık', 'Toprak'],
      emotions: ['Rahatlık', 'Sıcaklık', 'Geleneksellik'],
      negatives: ['Sıkıcılık', 'Ağırlık']
    },
    gray: {
      effects: ['Denge', 'Tarafsızlık', 'Olgunluk', 'Profesyonellik'],
      emotions: ['Sakinlik', 'Güvenilirlik', 'Ciddiyet'],
      negatives: ['Belirsizlik', 'Duygusuzluk']
    }
  };

  // Endüstri kullanımı
  const industries = {
    red: ['Yemek', 'Spor', 'Eğlence', 'Medya'],
    blue: ['Teknoloji', 'Finans', 'Sağlık', 'Güvenlik'],
    green: ['Çevre', 'Sağlık', 'Tarım', 'Eğitim'],
    yellow: ['Eğlence', 'Çocuk', 'Gıda', 'İnşaat'],
    purple: ['Güzellik', 'Lüks', 'Sanat', 'Eğlence'],
    orange: ['Yemek', 'Eğlence', 'Spor', 'Yaratıcılık'],
    pink: ['Güzellik', 'Moda', 'Çocuk', 'Eğlence'],
    brown: ['Kahve', 'Mobilya', 'Doğal Ürünler', 'Organik'],
    gray: ['Teknoloji', 'İş', 'Otomotiv', 'Mimari']
  };

  // En yakın ana rengi bul
  const baseColor = Object.keys(psychology).find(key => 
    colorName.toLowerCase().includes(key)
  ) || 'gray';

  return {
    name: colorName,
    characteristics: {
      temperature,
      intensity,
      brightness
    },
    psychology: psychology[baseColor],
    industries: industries[baseColor]
  };
};

// Renk paleti oluşturma fonksiyonları
export const generateColorPalettes = (baseColor) => {
  const hsl = hexToHSL(baseColor);
  
  return {
    monochromatic: {
      name: 'Monokromatik',
      description: 'Tek rengin farklı ton ve doygunluklarından oluşan palette',
      colors: [
        hslToHex(hsl.h, Math.min(100, hsl.s + 20), Math.min(100, hsl.l + 30)),
        hslToHex(hsl.h, Math.min(100, hsl.s + 10), Math.min(100, hsl.l + 15)),
        baseColor,
        hslToHex(hsl.h, Math.max(0, hsl.s - 10), Math.max(0, hsl.l - 15)),
        hslToHex(hsl.h, Math.max(0, hsl.s - 20), Math.max(0, hsl.l - 30))
      ]
    },
    pastel: {
      name: 'Pastel',
      description: 'Yüksek parlaklık ve düşük doygunlukta yumuşak renkler',
      colors: [
        hslToHex(hsl.h, 30, 90),
        hslToHex((hsl.h + 60) % 360, 30, 90),
        hslToHex((hsl.h + 120) % 360, 30, 90),
        hslToHex((hsl.h + 180) % 360, 30, 90),
        hslToHex((hsl.h + 240) % 360, 30, 90)
      ]
    },
    vibrant: {
      name: 'Canlı',
      description: 'Yüksek doygunlukta enerjik renkler',
      colors: [
        hslToHex(hsl.h, 100, 60),
        hslToHex((hsl.h + 72) % 360, 100, 60),
        hslToHex((hsl.h + 144) % 360, 100, 60),
        hslToHex((hsl.h + 216) % 360, 100, 60),
        hslToHex((hsl.h + 288) % 360, 100, 60)
      ]
    },
    compound: {
      name: 'Karma',
      description: 'Ana renk ve tamamlayıcı renklerin karışımı',
      colors: [
        baseColor,
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
      ]
    },
    neutral: {
      name: 'Nötr',
      description: 'Ana renkle uyumlu doğal ve nötr tonlar',
      colors: [
        hslToHex(hsl.h, Math.min(100, hsl.s + 10), 95),
        hslToHex(hsl.h, Math.min(100, hsl.s + 5), 85),
        baseColor,
        hslToHex(hsl.h, Math.max(0, hsl.s - 5), 25),
        hslToHex(hsl.h, Math.max(0, hsl.s - 10), 15)
      ]
    },
    analogous: {
      name: 'Analog',
      description: 'Renk çemberinde yan yana olan uyumlu renkler',
      colors: [
        hslToHex((hsl.h - 40) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h - 20) % 360, hsl.s, hsl.l),
        baseColor,
        hslToHex((hsl.h + 20) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 40) % 360, hsl.s, hsl.l)
      ]
    }
  };
}; 