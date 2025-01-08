# G-Color: Renk Paleti Oluşturucu

Modern ve kullanıcı dostu bir renk paleti oluşturma aracı. Tasarımcılar ve geliştiriciler için ideal olan bu uygulama, renk kombinasyonları oluşturmanızı, düzenlemenizi ve kaydetmenizi sağlar.

## 🌟 Özellikler

- **Sezgisel Arayüz**: Kullanıcı dostu ve modern tasarım
- **Renk Düzenleme**: Gelişmiş renk seçici ile hassas renk ayarları
- **Renk Harmonisi**: Otomatik renk harmoni önerileri
- **Erişilebilirlik Kontrolü**: WCAG standartlarına göre kontrast kontrolü
- **Palet Kaydetme**: Oluşturduğunuz paletleri kaydetme ve yönetme
- **Karanlık/Aydınlık Mod**: Göz yorgunluğunu azaltan tema seçenekleri
- **Renk Önerileri**: Yapay zeka destekli renk önerileri
- **Duyarlı Tasarım**: Tüm cihazlarda sorunsuz çalışma

## 🚀 Başlangıç

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullaniciadi/color-palette-generator.git
cd color-palette-generator
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

4. Tarayıcınızda açın:
```
http://localhost:5173
```

## 🛠️ Teknolojiler

- **React**: UI geliştirme için modern JavaScript kütüphanesi
- **Vite**: Hızlı geliştirme ve derleme için build tool
- **TailwindCSS**: Stil ve tasarım için utility-first CSS framework
- **Framer Motion**: Akıcı animasyonlar için hareket kütüphanesi
- **React Hot Toast**: Kullanıcı bildirimleri için toast kütüphanesi
- **React Icons**: Modern ve şık ikonlar

## 📦 Proje Yapısı

```
src/
├── components/           # UI bileşenleri
│   ├── AccessibilityChecker.jsx   # Erişilebilirlik kontrolü
│   ├── ColorCard.jsx             # Renk kartı bileşeni
│   ├── ColorEditor.jsx           # Renk düzenleme arayüzü
│   ├── ColorHarmony.jsx          # Renk harmoni önerileri
│   ├── ColorPalette.jsx          # Ana palet bileşeni
│   ├── ColorSuggestions.jsx      # Renk önerileri
│   ├── SavedPalettesModal.jsx    # Kayıtlı paletler modalı
│   └── Welcome.jsx               # Karşılama ekranı
├── context/             # React context yönetimi
├── utils/              # Yardımcı fonksiyonlar
└── App.jsx             # Ana uygulama bileşeni
```

## 🎨 Özellikler Detayı

### Renk Düzenleme
- HSL, RGB, ve HEX formatlarında renk düzenleme
- Renk tonu, doygunluk ve parlaklık ayarları
- Canlı önizleme

### Renk Harmonisi
- Komplementer renkler
- Monokromatik varyasyonlar
- Analogous renk önerileri
- Triadik renk kombinasyonları

### Erişilebilirlik
- WCAG 2.1 kontrast oranı kontrolü
- Erişilebilirlik önerileri
- Görsel engelliler için uyumluluk kontrolü

## 📱 Duyarlı Tasarım
- Mobil öncelikli tasarım
- Tablet ve masaüstü optimizasyonu
- Dokunmatik cihaz desteği


## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

Geliştirici: [Gürkay Çilinger]
İletişim: [gurkaycilingerr@gmail.com]