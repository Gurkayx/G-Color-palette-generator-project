export const colorNames = {
  '#FF0000': 'Kırmızı',
  '#00FF00': 'Yeşil',
  '#0000FF': 'Mavi',
  '#FFFF00': 'Sarı',
  '#FF00FF': 'Magenta',
  '#00FFFF': 'Cyan',
  '#000000': 'Siyah',
  '#FFFFFF': 'Beyaz',
  '#808080': 'Gri',
  '#800000': 'Bordo',
  '#808000': 'Zeytin Yeşili',
  '#008000': 'Koyu Yeşil',
  '#800080': 'Mor',
  '#008080': 'Turkuaz',
  '#000080': 'Lacivert',
  '#FFA500': 'Turuncu',
  '#FFC0CB': 'Pembe',
  '#800020': 'Vişne',
  '#FFD700': 'Altın Sarısı',
  '#C0C0C0': 'Gümüş',
  '#F0E68C': 'Krem',
  '#E6E6FA': 'Lavanta',
  '#98FB98': 'Açık Yeşil',
  '#DDA0DD': 'Erik',
  '#F08080': 'Mercan',
  '#CD853F': 'Kahverengi',
  '#FAF0E6': 'Keten',
  '#8B4513': 'Sedir',
  '#BA55D3': 'Orkide',
  '#4B0082': 'İndigo',
  '#556B2F': 'Haki',
  '#8B0000': 'Koyu Kırmızı',
  '#E9967A': 'Somon',
  '#FF69B4': 'Sıcak Pembe',
  '#4682B4': 'Çelik Mavisi',
  '#D2B48C': 'Taba',
  '#00CED1': 'Koyu Turkuaz',
  '#9400D3': 'Koyu Menekşe',
  '#FF1493': 'Derin Pembe',
  '#00BFFF': 'Derin Mavi',
  '#696969': 'Koyu Gri',
  '#1E90FF': 'Parlak Mavi',
  '#B8860B': 'Koyu Altın',
  '#32CD32': 'Limon Yeşili',
  '#FFB6C1': 'Açık Pembe',
  '#20B2AA': 'Açık Deniz Yeşili',
  '#87CEEB': 'Gök Mavisi',
  '#778899': 'Açık Çelik Grisi',
  '#B0C4DE': 'Açık Çelik Mavisi',
  '#FFFFE0': 'Açık Sarı',
  '#00FF7F': 'Bahar Yeşili',
  '#4169E1': 'Kraliyet Mavisi',
  '#F4A460': 'Kum Kahvesi',
  '#2E8B57': 'Deniz Yeşili',
  '#A0522D': 'Toprak',
  '#C71585': 'Orta Mor Kırmızı',
  '#6495ED': 'Mısır Çiçeği Mavisi'
};

export const findClosestColorName = (targetHex) => {
  const targetRgb = hexToRgb(targetHex);
  
  let minDistance = Infinity;
  let closestColorName = 'Bilinmeyen Renk';
  
  Object.entries(colorNames).forEach(([hex, name]) => {
    const currentRgb = hexToRgb(hex);
    const distance = Math.sqrt(
      Math.pow(targetRgb.r - currentRgb.r, 2) +
      Math.pow(targetRgb.g - currentRgb.g, 2) +
      Math.pow(targetRgb.b - currentRgb.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColorName = name;
    }
  });
  
  return closestColorName;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}; 