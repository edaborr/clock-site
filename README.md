# ⏱️ Zaman İstasyonu

Uzay temalı, koyu arayüzlü bir zaman araçları uygulaması. Next.js ile geliştirildi; saat, kronometre, geri sayım sayacı ve dünya saatlerini tek bir sayfada bir araya getirir.


## ✨ Özellikler

- **🕐 Saat** — Canlı saat ve tarih gösterimi
- **⏱️ Kronometre** — Başlat/durdur, tur (lap) alma, en hızlı/en yavaş turun vurgulanması
- **⏳ Sayaç** — Geri sayım, hazır süre şablonları, özel süre girişi, **Pomodoro modu** (25dk çalışma / 5dk mola)
- **🌍 Dünya Saatleri** — İstanbul, Londra, New York, Tokyo ve Sidney saatlerini eş zamanlı gösterir
- **🌌 Uzay temalı arka plan** — Mouse hareketine tepki veren parallax yıldız alanı ve ara sıra beliren kayan yıldızlar
- **🔔 Bildirimler** — Sayaç bitince ses efekti ve tarayıcı bildirimi
- **⌨️ Klavye kısayolları** — `Boşluk`: başlat/durdur · `L`: tur al · `R`: sıfırla
- **💾 Hafıza** — Son kullanılan sayaç süresi tarayıcıda hatırlanır
- **🔗 Paylaşılabilir link** — `?minutes=15` gibi bir URL parametresiyle belirli bir süreyle sayfa açılabilir
- **🎬 Akıcı geçişler** — Kartlar ve sekmeler arasında Framer Motion ile animasyonlu geçiş

## 🛠️ Kullanılan Teknolojiler

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- HTML5 Canvas (arka plan animasyonu)
- Web Audio API & Notification API

## 🚀 Kurulum

```bash
# Depoyu klonla
git clone https://github.com/edaborr/clock-site.git
cd clock-site

# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## 📁 Proje Yapısı

```
clock/
├─ app/
│   ├─ page.tsx          # Ana sayfa
│   ├─ layout.tsx        # Kök layout
│   └─ globals.css       # Global stiller
├─ components/
│   ├─ CardSwitcher.tsx      # Sekme ve kart geçiş yönetimi
│   ├─ ClockCard.tsx         # Saat kartı
│   ├─ StopwatchCard.tsx     # Kronometre kartı
│   ├─ TimerCard.tsx         # Sayaç / Pomodoro kartı
│   ├─ WorldClockCard.tsx    # Dünya saatleri kartı
│   └─ SpaceBackground.tsx   # Canvas tabanlı arka plan animasyonu
└─ hooks/
    ├─ useClock.ts       # Saat state yönetimi
    ├─ useStopwatch.ts   # Kronometre mantığı
    ├─ useTimer.ts       # Geri sayım mantığı
    └─ useSound.ts       # Ses ve bildirim yardımcıları
```

## 🎨 Tasarım

Koyu lacivert/uzay paleti (`#05060f` → `#101534`), yumuşak mavi-mor ve turuncu vurgu renkleri, glassmorphism (buzlu cam) kart stili.

## 📄 Lisans

Bu proje kişisel/eğitim amaçlı geliştirilmiştir.
